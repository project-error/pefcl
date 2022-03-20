import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';
import { Request } from '@typings/http';
import {
  Account,
  AccountType,
  AddToSharedAccountInput,
  ATMInput,
  PreDBAccount,
  RenameAccountInput,
  AccountRole,
  RemoveFromSharedAccountInput,
  SharedAccountUser,
} from '@typings/Account';
import { UserService } from '../user/user.service';
import { config } from '@utils/server-config';
import { mainLogger } from '../../sv_logger';
import { sequelize } from '../../utils/pool';
import { TransactionService } from '../transaction/transaction.service';
import { CashService } from '../cash/cash.service';
import i18next from '@utils/i18n';
import { TransactionType } from '@typings/transactions';
import { AccountModel } from './account.model';
import { ServerError } from '@utils/errors';
import { BalanceErrors, GenericErrors } from '@typings/Errors';

const logger = mainLogger.child({ module: 'accounts' });

@singleton()
export class AccountService {
  _accountDB: AccountDB;
  _cashService: CashService;
  _userService: UserService;
  _transactionService: TransactionService;

  constructor(
    accountDB: AccountDB,
    userService: UserService,
    cashService: CashService,
    transactionService: TransactionService,
  ) {
    this._accountDB = accountDB;
    this._cashService = cashService;
    this._userService = userService;
    this._transactionService = transactionService;
  }

  private async getMyAccounts(source: number) {
    const user = this._userService.getUser(source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.identifier);
    return accounts;
  }

  private async getMySharedAccounts(source: number): Promise<Account[]> {
    const user = this._userService.getUser(source);
    const accounts = await this._accountDB.getSharedAccountsByIdentifier(user.identifier);
    const mappedAccounts = accounts.map((sharedAccount) => {
      const acc = sharedAccount.getDataValue('account') as unknown as AccountModel;
      const sharedAcc = sharedAccount.toJSON();

      /* Override role by the shared one. */
      return {
        ...acc.toJSON(),
        role: sharedAcc.role,
      };
    });

    return mappedAccounts;
  }

  async handleGetDefaultAccount(source: number) {
    const user = this._userService.getUser(source);
    return await this._accountDB.getDefaultAccountByIdentifier(user.identifier);
  }

  async handleGetAccounts() {
    const accounts = await this._accountDB.getAccounts();
    return accounts.map((account) => account.toJSON());
  }

  async handleGetMyAccounts(source: number): Promise<Account[]> {
    logger.debug('Retrieving accounts');
    const accountModels = await this.getMyAccounts(source);
    const accounts = accountModels.map((account) => account.toJSON());
    const filteredAccounts = accounts.filter((account) => account.type !== AccountType.Shared);
    const sharedAccounts = await this.getMySharedAccounts(source);

    return [...filteredAccounts, ...sharedAccounts];
  }

  async addUserToShared(req: Request<AddToSharedAccountInput>) {
    logger.silly(`Adding user src: ${req.source} to shared account.`);

    // TODO: Add security
    return this._accountDB.createSharedAccount({
      name: req.data.name,
      user: req.data.identifier,
      role: req.data.role,
      accountId: req.data.accountId,
    });
  }

  async removeUserFromShared(req: Request<RemoveFromSharedAccountInput>) {
    logger.silly(`Removing user. identifier: ${req.data.identifier} to shared account.`);
    const { identifier, accountId } = req.data;
    const mySharedAccounts = await this._accountDB.getSharedAccountsByIdentifier(identifier);
    const deletingAccount = mySharedAccounts.find(
      (account) => account?.getDataValue('account')?.id === accountId,
    );

    return await deletingAccount?.destroy();
  }

  async createInitialAccount(source: number): Promise<Account> {
    logger.silly('Checking if default account exists ...');
    const user = this._userService.getUser(source);
    const defaultAccount = await this._accountDB.getDefaultAccountByIdentifier(user.identifier);

    if (defaultAccount) {
      logger.silly('Default account exists.');
      return defaultAccount.toJSON();
    }

    logger.debug('Creating initial account ...');
    const initialAccount = await this._accountDB.createAccount({
      accountName: i18next.t('Personal account'),
      isDefault: true,
      ownerIdentifier: user.identifier,
      type: AccountType.Personal,
    });

    logger.debug('Successfully created initial account.');
    return initialAccount.toJSON();
  }

  async handleCreateAccount(req: Request<PreDBAccount>): Promise<Account | undefined> {
    logger.silly('Trying to create a new account ...');
    logger.silly(req);

    const userIdentifier = this._userService.getUser(req.source).getIdentifier();

    const t = await sequelize.transaction();
    try {
      if (req.data.isDefault) {
        const defaultAccount = await this._accountDB.getDefaultAccountByIdentifier(userIdentifier);
        defaultAccount?.update({ isDefault: false });
      }

      const userAccounts = await this._accountDB.getAccountsByIdentifier(userIdentifier);
      const fromAccount = await this._accountDB.getAccount(req.data.fromAccountId);

      const isFirstSetup = userAccounts.length === 0;
      const isShared = req.data.isShared && !isFirstSetup;
      const isDefault = isFirstSetup ?? req.data.isDefault;

      if (!fromAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      const canAfford = fromAccount?.getDataValue('balance') < (config?.prices?.newAccount ?? 0);
      if (!canAfford || !isFirstSetup) {
        throw new ServerError(BalanceErrors.InsufficentFunds);
      }

      const defaultAccountName = isShared
        ? i18next.t('Shared account')
        : i18next.t('Personal account');

      const account = await this._accountDB.createAccount({
        ...req.data,
        accountName: req.data.accountName ?? defaultAccountName,
        type: isShared ? AccountType.Shared : AccountType.Personal,
        isDefault: isShared ? false : isDefault,
        ownerIdentifier: userIdentifier,
      });

      if (isShared) {
        await this._accountDB.createSharedAccount({
          accountId: account.getDataValue('id') ?? 0,
          user: userIdentifier,
          role: AccountRole.Owner,
        });
      }

      if (!isFirstSetup) {
        await fromAccount?.decrement('balance', { by: config?.prices?.newAccount ?? 0 });
        await this._transactionService.handleCreateTransaction({
          amount: config?.prices?.newAccount ?? 0,
          message: i18next.t('Opened a new account'),
          fromAccount: fromAccount.toJSON(),
          type: TransactionType.Outgoing,
        });
      }

      t.commit();
      return account.toJSON();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to create a new account');
      logger.silly(req);
      logger.error(e);
    }
  }

  async handleDeleteAccount(req: Request<{ accountId: number }>) {
    logger.silly('Trying to DELETE account ...');
    logger.silly(req);

    const t = await sequelize.transaction();
    try {
      const user = this._userService.getUser(req.source);
      const defaultAccount = await this.handleGetDefaultAccount(req.source);

      // TODO #2: Is this the best we can do?
      const deletingAccount = await this._accountDB.getMyAccountById(
        req.data.accountId,
        user.identifier,
      );

      // TODO: Implement smarter way of doing this check. Generally you can't access other players accounts.
      if (!deletingAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (!defaultAccount) {
        throw new ServerError(GenericErrors.MissingDefaultAccount);
      }

      const deletingAccountBalance = deletingAccount.getDataValue('balance');
      if (deletingAccountBalance < 0) {
        throw new Error('The balance of the account is too low. It cannot be deleted!');
      }

      await this._transactionService.handleCreateTransaction({
        amount: deletingAccountBalance,
        message: i18next.t('Remaining funds from "{{deletedAccount}}"', {
          deletedAccount: deletingAccount.getDataValue('accountName'),
        }),
        type: TransactionType.Transfer,
        fromAccount: deletingAccount.toJSON(),
        toAccount: defaultAccount.toJSON(),
      });

      await defaultAccount.increment('balance', { by: deletingAccountBalance });
      await deletingAccount.destroy();

      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to delete account');
      logger.silly(req);
      return;
    }

    logger.silly('Successfullt deleted account!');
    logger.silly(req);
    return;
  }

  async transferBalance(fromId: number, toId: number, amount: number, source: number) {
    logger.silly(`Transfering ${amount} from account ${fromId} to ${toId} ...`);
    const user = this._userService.getUser(source);

    const t = await sequelize.transaction();
    try {
      const fromAccount = await this._accountDB.getMyAccountById(fromId, user.identifier);
      const toAccount = await this._accountDB.getAccount(toId);

      if (!fromAccount || !toAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      fromAccount.decrement({ balance: amount });
      toAccount.increment({ balance: amount });

      t.commit();
      logger.silly(`Successfully transfered ${amount} from account ${fromId} to ${toId}.`);
    } catch (e) {
      t.rollback();
      logger.silly(`Failed to transfer ${amount} from account ${fromId} to ${toId}.`, e);
    }
  }

  /**
   * Deposition from player. Framework integrated.
   * Will then update whatever player's main bank account in any framework.
   * @param req
   */
  async handleDepositMoney(req: Request<ATMInput>) {
    logger.silly(
      `Source "${req.source}" depositing "${req.data.amount}" into "${
        req.data.accountId ?? 'DEFAULT'
      }"`,
    );
    const depositionAmount = req.data.amount;
    const targetAccount = req.data.accountId
      ? await this._accountDB.getAccount(req.data.accountId)
      : await this.handleGetDefaultAccount(req.source);

    if (!targetAccount) {
      throw new ServerError(GenericErrors.NotFound);
    }

    const userBalance = await this._cashService.getMyCash(req.source);
    const currentAccountBalance = targetAccount?.getDataValue('balance');

    /* Only run the export when account is the default(?). Not sure about this. */
    const t = await sequelize.transaction();
    try {
      if (userBalance < depositionAmount) {
        logger.debug({ userBalance, depositionAmount, currentAccountBalance });
        throw new Error('Insufficent funds.');
      }

      /* Check this part. - Deposition from. */
      await this._cashService.handleTakeCash(req.source, depositionAmount);
      await targetAccount.increment({ balance: depositionAmount });
      await this._transactionService.handleCreateTransaction({
        amount: depositionAmount,
        message: req.data.message,
        type: TransactionType.Incoming,
        toAccount: targetAccount.toJSON(),
      });

      logger.silly(
        `Successfully deposited ${depositionAmount} into account ${targetAccount.getDataValue(
          'id',
        )}`,
      );
      logger.silly({ userBalance, depositionAmount, currentAccountBalance });
      t.commit();
    } catch (err) {
      logger.error(`Failed to deposit money into account ${targetAccount.getDataValue('id')}`);
      logger.error(err);
      t.rollback();
    }
  }

  async handleWithdrawMoney(req: Request<ATMInput>) {
    logger.silly(`"${req.source}" withdrawing "${req.data.amount}"`);
    const targetAccount = req.data.accountId
      ? await this._accountDB.getAccount(req.data.accountId)
      : await this.handleGetDefaultAccount(req.source);
    const withdrawAmount = req.data.amount;

    if (!targetAccount) {
      throw new ServerError(GenericErrors.NotFound);
    }

    const accountId = targetAccount.getDataValue('id') ?? 0;
    const currentAccountBalance = targetAccount.getDataValue('balance');

    /* Only run the export when account is the default(?). Not sure about this. */
    const t = await sequelize.transaction();
    try {
      if (currentAccountBalance < withdrawAmount) {
        logger.debug({ withdrawAmount, currentAccountBalance });
        throw new Error('Insufficent funds.');
      }

      await this._cashService.handleGiveCash(req.source, withdrawAmount);
      await targetAccount.decrement({ balance: withdrawAmount });

      await this._transactionService.handleCreateTransaction({
        amount: withdrawAmount,
        message: req.data.message,
        type: TransactionType.Outgoing,
        toAccount: targetAccount.toJSON(),
      });

      logger.silly(`Withdrew ${withdrawAmount} from account ${accountId}`);
      logger.silly({ withdrawAmount, currentAccountBalance });
      t.commit();
    } catch (err) {
      logger.error(`Failed to withdraw money from account ${accountId}`);
      logger.error(err);
      t.rollback();
    }
  }

  async handleSetDefaultAccount(req: Request<{ accountId: number }>) {
    const user = this._userService.getUser(req.source);
    logger.silly(
      `Changing default account for user ${user.identifier} to accountId ${req.data.accountId} ...`,
    );

    const t = await sequelize.transaction();
    try {
      const defaultAccount = await this._accountDB.getDefaultAccountByIdentifier(
        user?.getIdentifier() ?? '',
      );
      const newDefaultAccount = await this._accountDB.getAccount(req.data.accountId);

      if (!newDefaultAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (newDefaultAccount.getDataValue('type') === AccountType.Shared) {
        throw new Error('Cannot set shared account as default');
      }

      if (defaultAccount?.getDataValue('id') === req.data.accountId) {
        throw new Error('This is already the default account');
      }

      await defaultAccount?.update({ isDefault: false });
      await newDefaultAccount.update({ isDefault: true });

      t.commit();
      return newDefaultAccount;
    } catch (err) {
      logger.error(`Failed to change default account for ${user?.getIdentifier()}`);
      logger.error(err);

      t.rollback();
    }

    logger.silly(`Successfully changed default account to ${req.data.accountId}`);
    logger.silly({ accountId: req.data.accountId, userId: user?.getIdentifier() });
  }

  // TODO: Implement similar security for updating accounts etc.
  async handleRenameAccount(req: Request<RenameAccountInput>) {
    const user = this._userService.getUser(req.source);
    return await this._accountDB.editAccount({
      accountName: req.data.name,
      id: req.data.accountId,
      ownerIdentifier: user?.getIdentifier(),
    });
  }

  async getUsersFromShared(req: Request<{ accountId: number }>): Promise<SharedAccountUser[]> {
    const sharedAccounts = await this._accountDB.getSharedAccountsById(req.data.accountId);
    return sharedAccounts.map((account) => ({
      name: account.getDataValue('name'),
      user: account.getDataValue('user'),
      role: account.getDataValue('role'),
    }));
  }
}

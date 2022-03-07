import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';
import { Request } from '../../../../typings/http';
import { Account, AccountType, DepositDTO, PreDBAccount } from '../../../../typings/accounts';
import { UserService } from '../../user/user.service';
import { config } from '../../server-config';
import { AccountServiceExports } from '../../../../typings/exports';
import { mainLogger } from '../../sv_logger';
import { sequelize } from '../../db/pool';
import { TransactionService } from '../transaction/transaction.service';
const exp: AccountServiceExports = global.exports[config.exports.resourceName];

const logger = mainLogger.child({ module: 'accountService' });

@singleton()
export class AccountService {
  _accountDB: AccountDB;
  _userService: UserService;
  _transactionService: TransactionService;

  constructor(
    accountDB: AccountDB,
    userService: UserService,
    transactionService: TransactionService,
  ) {
    this._accountDB = accountDB;
    this._userService = userService;
    this._transactionService = transactionService;
  }

  private getMyAccounts(source: number) {
    const user = this._userService.getUser(source);
    const accounts = this._accountDB.getAccountsByIdentifier(user.identifier);
    return accounts;
  }

  async handleGetAccounts() {
    // const user = this._userService.getUser(source);
    const accounts = await this._accountDB.getAccounts();

    // Add user here, or create relation thing.
    return accounts.map((account) => ({ ...account.toJSON() }));
  }

  async handleGetMyAccounts(source: number) {
    const accounts = await this.getMyAccounts(source);
    return accounts.map((account) => account.toJSON());
  }

  async handleCreateAccount(dto: Request<PreDBAccount>): Promise<Account> {
    const userIdentifier = this._userService.getUser(dto.source).getIdentifier();
    const account = await this._accountDB.createAccount({
      ...dto.data,
      type: dto.data.type ?? AccountType.Personal,
      isDefault: dto.data.isDefault ?? false,
      ownerIdentifier: userIdentifier,
    });
    return account.toJSON();
  }

  async handleDeleteAccount(account: Account) {
    await this._accountDB.deleteAccount(account.id);
  }

  async transferBalance(fromId: number, toId: number, amount: number, source: number) {
    logger.silly(`Transfering ${amount} from account ${fromId} to ${toId} ...`);

    const t = await sequelize.transaction();
    try {
      const availableAccounts = await this.getMyAccounts(source);
      const fromAccount = availableAccounts.find(
        (account) => account.getDataValue('id') === fromId,
      );
      const toAccount = await this._accountDB.getAccount(toId);

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
  async handleDepositMoney(req: Request<DepositDTO>) {
    logger.silly(`Depositing ${req.data.amount} into account ${req.data.accountId} ...`);
    const targetAccount = await this._accountDB.getAccount(req.data.accountId);
    const depositionAmount = req.data.amount;

    const userBalance = this._userService.getUser(req.source).getBalance();
    const currentAccountBalance = targetAccount.getDataValue('balance');

    if (userBalance < depositionAmount) {
      logger.silly({ userBalance, depositionAmount, currentAccountBalance });
      throw new Error('Insufficent funds.');
    }

    /* Only run the export when account is the default(?). Not sure about this. */
    if (config.general.useFrameworkIntegration && targetAccount.getDataValue('isDefault')) {
      exp.pefclDepositMoney(req.source, depositionAmount);
    }

    await targetAccount.increment({ balance: depositionAmount });
    await this._transactionService.handleCreateTransaction(
      depositionAmount,
      req.data.message,
      targetAccount.toJSON(),
    );
    logger.silly(`Successfully deposited ${depositionAmount} into account ${req.data.accountId}`);
    logger.silly({ userBalance, depositionAmount, currentAccountBalance });
  }

  async handleSetDefaultAccount(req: Request<{ accountId: number }>) {
    const user = this._userService.getUser(req.source);
    logger.silly(
      `Changing default account for user ${user.identifier} to accountId ${req.data.accountId} ...`,
    );

    const t = await sequelize.transaction();
    try {
      const defaultAccount = await this._accountDB.getDefaultAccountByIdentifier(user.identifier);
      const newDefaultAccount = await this._accountDB.getAccount(req.data.accountId);

      if (defaultAccount.getDataValue('id') === req.data.accountId) {
        throw new Error('This is already the default account');
      }

      await defaultAccount.update({ isDefault: false });
      await newDefaultAccount.update({ isDefault: true });

      t.commit();
    } catch (err) {
      logger.error(`Failed to change default account for ${user.identifier}`);
      logger.error(err);

      t.rollback();
    }

    logger.silly(`Successfully changed default account to ${req.data.accountId}`);
    logger.silly({ accountId: req.data.accountId, userId: user.identifier });
  }
}

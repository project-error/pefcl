import { singleton } from 'tsyringe';
import { Request } from '@typings/http';
import {
  GetTransactionHistoryResponse,
  GetTransactionsInput,
  GetTransactionsResponse,
  Transaction,
  TransactionInput,
  TransactionType,
  Transfer,
  TransferType,
} from '@typings/transactions';
import { sequelize } from '@server/utils/pool';
import { mainLogger } from '@server/sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { TransactionDB } from './transaction.db';
import { TransactionModel } from './transaction.model';
import { ExternalAccountService } from '@services/accountExternal/externalAccount.service';
import { ServerError } from '@utils/errors';
import { GenericErrors } from '@typings/Errors';
import { AccountRole } from '@typings/Account';
import { MS_ONE_WEEK } from '@utils/constants';
import { Broadcasts } from '@typings/Events';
import { SharedAccountDB } from '../accountShared/sharedAccount.db';
import { Transaction as SequelizeTransaction } from 'sequelize/types';

const logger = mainLogger.child({ module: 'transactionService' });

@singleton()
export class TransactionService {
  _accountDB: AccountDB;
  _sharedAccountDB: SharedAccountDB;
  _transactionDB: TransactionDB;
  _userService: UserService;
  _externalAccountService: ExternalAccountService;

  constructor(
    transactionDB: TransactionDB,
    userService: UserService,
    accountDB: AccountDB,
    sharedAccountDB: SharedAccountDB,
    externalAccountService: ExternalAccountService,
  ) {
    this._transactionDB = transactionDB;
    this._userService = userService;
    this._accountDB = accountDB;
    this._sharedAccountDB = sharedAccountDB;
    this._externalAccountService = externalAccountService;
  }

  private async getMyTransactions(req: Request<GetTransactionsInput>) {
    const user = this._userService.getUser(req.source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());

    const accountIds = accounts.map((account) => account.getDataValue('id') ?? 0);
    const transactions = await this._transactionDB.getTransactionFromAccounts({
      ...req.data,
      accountIds,
    });
    const total = await this._transactionDB.getTotalTransactionsFromAccounts(accountIds);

    // const mappedTransactions = transactions.map((transaction) => {
    //   const date = new Date(transaction.getDataValue('createdAt') ?? '');
    //   transaction.setDataValue('createdAt', date.toLocaleString());
    //   return transaction;
    // });

    return {
      total: total,
      offset: req.data.offset,
      limit: req.data.limit,
      transactions: transactions,
    };
  }

  async handleGetMyTransactions(
    req: Request<GetTransactionsInput>,
  ): Promise<GetTransactionsResponse> {
    const data = await this.getMyTransactions(req);
    return {
      ...data,
      transactions: data.transactions as unknown as Transaction[],
    };
  }

  private async handleInternalTransfer(req: Request<Transfer>) {
    logger.silly('Creating internal transfer');
    logger.silly(req);

    const user = this._userService.getUser(req.source);
    const identifier = user.getIdentifier();
    const { fromAccountId, toAccountId, amount, message } = req.data;

    const t = await sequelize.transaction();
    try {
      const myAccount = await this._accountDB.getAuthorizedAccountById(fromAccountId, identifier);
      const sharedAccount = await this._sharedAccountDB.getAuthorizedSharedAccountById(
        fromAccountId,
        identifier,
        [AccountRole.Admin, AccountRole.Owner],
      );

      const fromAccount = myAccount ?? sharedAccount;
      const toAccount = await this._accountDB.getAccountById(toAccountId);

      if (!toAccount || !fromAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      await toAccount.increment('balance', { by: amount });
      await fromAccount.decrement('balance', { by: amount });
      await this.handleCreateTransaction(
        {
          amount: amount,
          message: message,
          toAccount: toAccount.toJSON(),
          type: TransactionType.Transfer,
          fromAccount: fromAccount.toJSON(),
        },
        t,
      );

      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to create internal transfer');
      logger.silly(e);
      throw e;
    }
  }

  private async handleExternalTransfer(req: Request<Transfer>) {
    const t = await sequelize.transaction();
    try {
      const myAccount = await this._accountDB.getAccountById(req.data.fromAccountId);
      const toAccount = await this._externalAccountService.getAccountFromExternalAccount(
        req.data.toAccountId,
      );

      if (!toAccount || !myAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      await myAccount.decrement('balance', { by: req.data.amount, transaction: t });
      await toAccount.increment('balance', { by: req.data.amount, transaction: t });

      /*  Since this is a external "transfer", it's not actually a TransactionType.Transfer.
          But a seperate TransactionType.Incoming & TransactionType.Outgoing.
          
          For the person initializing the transfer, this is Outgoing.
      */

      const data = {
        amount: req.data.amount,
        message: req.data.message,
        toAccount: toAccount.toJSON(),
        fromAccount: myAccount.toJSON(),
      };
      await this.handleCreateTransaction({ ...data, type: TransactionType.Outgoing }, t);
      await this.handleCreateTransaction({ ...data, type: TransactionType.Incoming }, t);

      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly('Failed to create internal transfer');
      logger.silly(e);
      throw e;
    }
  }

  async handleTransfer(req: Request<Transfer>) {
    logger.silly(
      `Transfering ${req.data.amount} from account ${req.data.fromAccountId} to ${req.data.toAccountId} ...`,
    );
    const isExternalTransfer = req.data.type === TransferType.External;
    if (isExternalTransfer) {
      return await this.handleExternalTransfer(req);
    }
    return await this.handleInternalTransfer(req);
  }

  async handleCreateTransaction(
    input: TransactionInput,
    sequelizeTransaction: SequelizeTransaction,
  ): Promise<TransactionModel | null> {
    logger.silly(`Created transaction.`);
    logger.silly(input);

    const transaction = await this._transactionDB.create(input, sequelizeTransaction);

    sequelizeTransaction.afterCommit(() => {
      this.broadcastTransaction({ ...input, ...transaction.toJSON() });
    });

    return transaction;
  }

  async broadcastTransaction(transaction: Transaction) {
    logger.silly(`Broadcasted transaction:`);
    logger.silly(JSON.stringify(transaction));

    const { ownerIdentifier } = transaction.toAccount ?? {};
    const user = this._userService.getUserByIdentifier(ownerIdentifier ?? '');

    if (!user) {
      return;
    }

    emitNet(Broadcasts.NewTransaction, user.getSource(), transaction);
  }

  async handleGetHistory(req: Request<void>): Promise<GetTransactionHistoryResponse> {
    const user = this._userService.getUser(req.source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());

    const from = new Date(Date.now() - MS_ONE_WEEK);
    const accountIds = accounts.map((account) => account.getDataValue('id') ?? 0);
    const transactions = await this._transactionDB.getAllTransactionsFromAccounts(accountIds, from);

    const expenses = transactions.reduce((prev, curr) => {
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      return type === TransactionType.Outgoing ? prev - amount : prev;
    }, 0);

    const income = transactions.reduce((prev, curr) => {
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      return type === TransactionType.Incoming ? prev + amount : prev;
    }, 0);

    const lastWeek = transactions.reduce((prev, curr) => {
      const date = new Date(curr.getDataValue('createdAt') ?? '');
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      const isIncoming = type === TransactionType.Incoming;
      const isOutgoing = type === TransactionType.Outgoing;

      const localeDate = date.toDateString();

      const { income = 0, expenses = 0 } = prev[localeDate] ?? {};
      const newIncome = isIncoming ? income + amount : income;
      const newExpenses = isOutgoing ? expenses - amount : expenses;

      return {
        ...prev,
        [localeDate]: {
          income: newIncome,
          expenses: newExpenses,
        },
      };
    }, {} as Record<string, { income: number; expenses: number }>);

    return {
      income,
      lastWeek,
      expenses: expenses,
    };
  }
}

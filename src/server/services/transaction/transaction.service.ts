import { singleton } from 'tsyringe';
import { Account } from '../../../../typings/accounts';
import { Request } from '../../../../typings/http';
import { Transaction, TransactionType, Transfer } from '../../../../typings/transactions';
import { sequelize } from '../../db/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { AccountModel } from '../account/account.model';
import { TransactionDB } from './transaction.db';
import { TransactionModel } from './transaction.model';

const logger = mainLogger.child({ module: 'transactionService' });

@singleton()
export class TransactionService {
  _accountDB: AccountDB;
  _transactionDB: TransactionDB;
  _userService: UserService;

  constructor(transactionDB: TransactionDB, userService: UserService, accountDB: AccountDB) {
    this._transactionDB = transactionDB;
    this._userService = userService;
    this._accountDB = accountDB;
  }

  private async getMyTransactions(source: number) {
    const user = this._userService.getUser(source);
    const transactions = await this._transactionDB.getTransactions();
    return transactions;
  }

  async handleGetMyTransactions(source: number): Promise<Transaction[]> {
    const transactions = await this.getMyTransactions(source);
    return transactions.map((transaction) => transaction.toJSON()) as unknown as Transaction[];
  }

  async handleTransfer(req: Request<Transfer>) {
    logger.silly(
      `Transfering ${req.data.amount} from account ${req.data.fromAccountId} to ${req.data.toAccountId} ...`,
    );

    const t = await sequelize.transaction();
    try {
      const fromAccount = await this._accountDB.getAccount(req.data.fromAccountId);
      const toAccount = await this._accountDB.getAccount(req.data.toAccountId);

      await fromAccount.decrement('balance', { by: req.data.amount });
      await toAccount.increment('balance', { by: req.data.amount });

      await this._transactionDB.create({
        amount: req.data.amount,
        message: req.data.message,
        toAccount: toAccount.toJSON(),
        type: TransactionType.Transfer,
        fromAccount: fromAccount.toJSON(),
      });

      t.commit();
    } catch (e) {
      t.rollback();
      logger.silly(
        `Failed to transfer ${req.data.amount} from account ${req.data.fromAccountId} to ${req.data.toAccountId}.`,
      );
      logger.silly(e);
    }

    return true;
  }

  async handleCreateTransaction(
    amount: number,
    message: string,
    toAccount: Account,
    fromAccount?: Account,
  ): Promise<TransactionModel> {
    logger.silly(`Created transaction.`);
    logger.silly({ amount, message });
    return await this._transactionDB.create({
      amount,
      message,
      toAccount,
      fromAccount,
    });
  }
}

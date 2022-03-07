import { singleton } from 'tsyringe';
import { Account } from '../../../../typings/accounts';
import { Transaction } from '../../../../typings/transactions';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../../user/user.service';
import { AccountModel } from '../account/account.model';
import { TransactionDB } from './transaction.db';
import { TransactionModel } from './transaction.model';

const logger = mainLogger.child({ module: 'transactionService' });

@singleton()
export class TransactionService {
  _transactionDB: TransactionDB;
  _userService: UserService;

  constructor(transactionDB: TransactionDB, userService: UserService) {
    this._transactionDB = transactionDB;
    this._userService = userService;
  }

  private async getMyTransactions(source: number) {
    // logger.silly(`Transfering ${amount} from account ${fromId} to ${toId} ...`);
    const user = this._userService.getUser(source);
    const transactions = await this._transactionDB.getTransactions();
    return transactions;
  }

  async handleGetMyTransactions(source: number): Promise<Transaction[]> {
    const transactions = await this.getMyTransactions(source);
    return transactions.map((transaction) => transaction.toJSON()) as unknown as Transaction[];
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

import { singleton } from 'tsyringe';
import { Transaction } from '../../../../typings/accounts';
import { AccountModel } from '../account/account.model';
import { TransactionModel } from './transaction.model';

@singleton()
export class TransactionDB {
  async getTransactions(): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      include: [
        { model: AccountModel, as: 'toAccount' },
        { model: AccountModel, as: 'fromAccount' },
      ],
    });
  }

  async getTransaction(id: number): Promise<TransactionModel> {
    return await TransactionModel.findOne({ where: { id } });
  }

  async create(transaction: Partial<Transaction>): Promise<TransactionModel> {
    const newTransaction = await TransactionModel.create(
      {
        ...transaction,
        toAccount: transaction.toAccount.id,
        fromAccount: transaction.fromAccount?.id,
      },
      {
        include: [
          { model: AccountModel, as: 'toAccount' },
          { model: AccountModel, as: 'fromAccount' },
        ],
      },
    );
    return newTransaction;
  }
}

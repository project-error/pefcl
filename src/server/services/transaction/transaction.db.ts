import { singleton } from 'tsyringe';
import { Transaction } from '../../../../typings/transactions';
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
    const { toAccount, fromAccount, ...dbTransaction } = transaction;
    const newTransaction = await TransactionModel.create({
      ...dbTransaction,
    });

    const currentMessage = newTransaction.getDataValue('message');
    const currentId = newTransaction.getDataValue('id');
    await newTransaction.update({ message: `${currentMessage} #${currentId}` });

    // TODO: Get TS support for this shit.
    //@ts-ignore
    await newTransaction.setToAccount(toAccount?.id);
    //@ts-ignore
    await newTransaction.setFromAccount(fromAccount?.id);

    return await newTransaction.save();
  }
}

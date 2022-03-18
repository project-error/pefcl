import { Op } from 'sequelize';
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

  async getTransactionFromAccounts(accountIds: number[]): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      where: {
        [Op.or]: [
          {
            fromAccountId: {
              [Op.in]: accountIds,
            },
          },
          {
            toAccountId: {
              [Op.in]: accountIds,
            },
          },
        ],
      },
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await newTransaction.setToAccount(toAccount?.id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await newTransaction.setFromAccount(fromAccount?.id);

    return await newTransaction.save();
  }
}

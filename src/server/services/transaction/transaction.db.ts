import { Op } from 'sequelize';
import { singleton } from 'tsyringe';
import { GetTransactionsInput, TransactionInput } from '@typings/transactions';
import { AccountModel } from '../account/account.model';
import { TransactionModel } from './transaction.model';
import { config } from '@utils/server-config';

interface GetTransactionFromAccounts extends GetTransactionsInput {
  accountIds: number[];
}
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

  async getTotalTransactionsFromAccounts(accountIds: number[]): Promise<number> {
    return await TransactionModel.count({
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
    });
  }

  async getTransactionFromAccounts(input: GetTransactionFromAccounts): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      where: {
        [Op.or]: [
          {
            fromAccountId: {
              [Op.in]: input.accountIds,
            },
          },
          {
            toAccountId: {
              [Op.in]: input.accountIds,
            },
          },
        ],
      },
      limit: input.limit ?? config?.transactions?.defaultLimit ?? 10,
      offset: input.offset,
      include: [
        { model: AccountModel, as: 'toAccount' },
        { model: AccountModel, as: 'fromAccount' },
      ],
    });
  }

  async getTransaction(id: number): Promise<TransactionModel | null> {
    return await TransactionModel.findOne({ where: { id } });
  }

  async create(transaction: TransactionInput): Promise<TransactionModel> {
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

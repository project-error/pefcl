import { Op } from 'sequelize';
import { singleton } from 'tsyringe';
import { GetTransactionsInput, TransactionInput, TransactionType } from '@typings/Transaction';
import { AccountModel } from '../account/account.model';
import { TransactionModel } from './transaction.model';
import { Transaction as SequelizeTransaction } from 'sequelize/types';

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
            [Op.and]: {
              fromAccountId: {
                [Op.in]: accountIds,
              },
              type: TransactionType.Outgoing,
            },
          },
          {
            [Op.and]: {
              toAccountId: {
                [Op.in]: accountIds,
              },
              type: TransactionType.Incoming,
            },
          },
          {
            [Op.and]: {
              [Op.or]: {
                toAccountId: {
                  [Op.in]: accountIds,
                },
                fromAccountId: {
                  [Op.in]: accountIds,
                },
              },
              type: TransactionType.Transfer,
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
            [Op.and]: {
              fromAccountId: {
                [Op.in]: input.accountIds,
              },
              type: TransactionType.Outgoing,
            },
          },
          {
            [Op.and]: {
              toAccountId: {
                [Op.in]: input.accountIds,
              },
              type: TransactionType.Incoming,
            },
          },
          {
            [Op.and]: {
              [Op.or]: {
                toAccountId: {
                  [Op.in]: input.accountIds,
                },
                fromAccountId: {
                  [Op.in]: input.accountIds,
                },
              },
              type: TransactionType.Transfer,
            },
          },
        ],
      },
      limit: input.limit ?? 10,
      offset: input.offset,
      order: [['createdAt', 'DESC']],
      include: [
        { model: AccountModel, as: 'toAccount' },
        { model: AccountModel, as: 'fromAccount' },
      ],
    });
  }

  async getAllTransactionsFromAccounts(
    accountIds: number[],
    from?: Date,
  ): Promise<TransactionModel[]> {
    //TODO: clean this up
    const createdAt = from
      ? {
          [Op.gte]: from,
        }
      : {
          [Op.lte]: new Date(),
        };

    return await TransactionModel.findAll({
      where: {
        createdAt,
        [Op.or]: [
          {
            [Op.and]: {
              fromAccountId: {
                [Op.in]: accountIds,
              },
              type: TransactionType.Outgoing,
            },
          },
          {
            [Op.and]: {
              toAccountId: {
                [Op.in]: accountIds,
              },
              type: TransactionType.Incoming,
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

  async getTransaction(id: number): Promise<TransactionModel | null> {
    return await TransactionModel.findOne({ where: { id } });
  }

  async create(
    transaction: TransactionInput,
    sequelizeTransaction: SequelizeTransaction,
  ): Promise<TransactionModel> {
    const { toAccount, fromAccount, ...dbTransaction } = transaction;
    const newTransaction = await TransactionModel.create(
      {
        ...dbTransaction,
      },
      { transaction: sequelizeTransaction },
    );

    const currentMessage = newTransaction.getDataValue('message');
    const currentId = newTransaction.getDataValue('id');
    await newTransaction.update(
      { message: `${currentMessage} #${currentId}` },
      { transaction: sequelizeTransaction },
    );

    newTransaction.setToAccount(toAccount?.id);
    newTransaction.setFromAccount(fromAccount?.id);

    return newTransaction;
  }
}

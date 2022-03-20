import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';
import { singleton } from 'tsyringe';
import { Transaction, TransactionType } from '../../../../typings/transactions';
import { sequelize } from '../../utils/pool';

interface TransactionDB extends Omit<Transaction, 'toAccount' | 'fromAccount'> {
  toAccount?: number;
  toAccountId?: number;
  fromAccount?: number;
  fromAccountId?: number;
}

@singleton()
export class TransactionModel extends Model<TransactionDB> {}

TransactionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: TransactionType.Outgoing, // Outgoing = Money leaves ur account, Incoming = Money goes into ur account
    },
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'transactions' },
);

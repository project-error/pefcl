import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';
import { singleton } from 'tsyringe';
import { Transaction, TransactionType } from '../../../../typings/transactions';
import { sequelize } from '../../utils/pool';

interface TransactionDB extends Omit<Transaction, 'toAccount' | 'fromAccount'> {
  toAccount?: number;
  fromAccount?: number;
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
    identifier: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
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

import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { singleton } from 'tsyringe';
import { Transaction, TransactionType } from '../../../../typings/Transaction';
import { sequelize } from '../../utils/pool';
import { timestamps } from '../timestamps.model';

@singleton()
export class TransactionModel extends Model<
  Transaction,
  Optional<Transaction, 'id' | 'createdAt' | 'updatedAt'>
> {}

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
      defaultValue: TransactionType.Outgoing,
    },
    ...timestamps,
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'transactions' },
);

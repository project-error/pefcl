import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';
import { Cash } from '@typings/Cash';
import { sequelize } from '../../utils/pool';
import { config } from '@utils/server-config';

export class CashModel extends Model<Cash> {}

CashModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: config.cash.defaultAmount ?? 0,
    },
    ownerIdentifier: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'cash' },
);

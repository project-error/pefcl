import { DataTypes, Model } from 'sequelize';
import { Cash } from '../../../../typings/Cash';
import { sequelize } from '../../db/pool';
import { config } from '../../server-config';

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
  { sequelize: sequelize, tableName: 'cash' },
);

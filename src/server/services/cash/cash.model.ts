import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { Cash } from '@typings/Cash';
import { sequelize } from '../../utils/pool';
import { config } from '@utils/server-config';
import { timestamps } from '../timestamps.model';

export class CashModel extends Model<Cash, Optional<Cash, 'id' | 'amount'>> {}

CashModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: config?.cash?.startAmount ?? 0,
    },
    ownerIdentifier: {
      type: DataTypes.STRING,
      unique: true,
    },
    ...timestamps,
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'cash' },
);

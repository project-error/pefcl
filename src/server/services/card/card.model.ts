import { Card } from '@server/../../typings/BankCard';
import { generateCardNumber } from '@server/utils/misc';
import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { singleton } from 'tsyringe';
import { sequelize } from '../../utils/pool';
import { timestamps } from '../timestamps.model';

export type CardModelCreate = Optional<
  Card,
  'id' | 'number' | 'pin' | 'isBlocked' | 'createdAt' | 'updatedAt'
>;

@singleton()
export class CardModel extends Model<Card, CardModelCreate> {}
CardModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    holder: {
      type: DataTypes.STRING,
    },
    holderCitizenId: {
      type: DataTypes.STRING,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    number: {
      type: DataTypes.STRING,
      defaultValue: generateCardNumber,
    },
    pin: {
      type: DataTypes.INTEGER,
      defaultValue: 1234,
    },
    ...timestamps,
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'cards' },
);

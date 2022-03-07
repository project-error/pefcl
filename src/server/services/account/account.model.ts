import { DataTypes, Model } from 'sequelize';
import { Account, AccountType } from '../../../../typings/accounts';
import { sequelize } from '../../db/pool';

export class AccountModel extends Model<Account> {}

AccountModel.init(
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
    accountName: {
      type: DataTypes.STRING,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ownerIdentifier: {
      type: DataTypes.STRING,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: AccountType.Personal,
    },
  },
  { sequelize: sequelize, tableName: 'accounts' },
);

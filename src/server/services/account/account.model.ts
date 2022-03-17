import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';
import { config } from '@utils/server-config';
import { Account, AccountRole, AccountType } from '@typings/Account';
import { sequelize } from '../../utils/pool';

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
    role: {
      type: DataTypes.STRING,
      defaultValue: AccountRole.Owner,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: config.accounts.defaultAmount ?? 0,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: AccountType.Personal,
    },
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'accounts', paranoid: true },
);

import { AccountRole, SharedAccount } from '@typings/Account';
import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utils/pool';

export class SharedAccountModel extends Model<SharedAccount> {}

SharedAccountModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: AccountRole.Contributor,
    },
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'shared_accounts', paranoid: true },
);

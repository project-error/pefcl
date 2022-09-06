import { AccountRole, SharedAccount } from '@typings/Account';
import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../utils/pool';
import { timestamps } from '../timestamps.model';

export class SharedAccountModel extends Model<
  SharedAccount,
  Optional<SharedAccount, 'id' | 'role'>
> {}

SharedAccountModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userIdentifier: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: AccountRole.Contributor,
    },
    ...timestamps,
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'shared_accounts', paranoid: true },
);

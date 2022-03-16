import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model } from 'sequelize';
import { SharedAccount } from '../../../../typings/accounts';
import { sequelize } from '../../db/pool';

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
  },
  { sequelize: sequelize, tableName: DATABASE_PREFIX + 'shared_accounts', paranoid: true },
);

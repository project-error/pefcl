import { ExternalAccount } from '@typings/Account';
import { DATABASE_PREFIX } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../utils/pool';

export class ExternalAccountModel extends Model<ExternalAccount, Optional<ExternalAccount, 'id'>> {}

ExternalAccountModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelize,
    tableName: DATABASE_PREFIX + 'external_accounts',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'number'],
      },
    ],
  },
);

import { DATABASE_PREFIX, MS_TWO_WEEKS } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { singleton } from 'tsyringe';
import { Invoice, InvoiceStatus } from '../../../../typings/Invoice';
import { sequelize } from '../../utils/pool';
import { timestamps } from '../timestamps.model';

@singleton()
export class InvoiceModel extends Model<
  Invoice,
  Optional<Invoice, 'id' | 'status' | 'receiverAccountIdentifier'>
> {}

InvoiceModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    to: {
      defaultValue: 'unknown',
      type: DataTypes.STRING,
      validate: {
        max: 80,
        min: 1,
      },
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 80,
        min: 1,
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 80,
        min: 1,
      },
    },
    fromIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverAccountIdentifier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: InvoiceStatus.PENDING,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return new Date(this.getDataValue('expiresAt') ?? '').getTime();
      },
      defaultValue: () => new Date(Date.now() + MS_TWO_WEEKS).toString(),
    },
    ...timestamps,
  },
  {
    sequelize: sequelize,
    tableName: DATABASE_PREFIX + 'invoices',
  },
);

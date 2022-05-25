import { DATABASE_PREFIX, MS_TWO_WEEKS } from '@utils/constants';
import { DataTypes, Model, Optional } from 'sequelize';
import { singleton } from 'tsyringe';
import { Invoice, InvoiceStatus } from '../../../../typings/Invoice';
import { sequelize } from '../../utils/pool';

@singleton()
export class InvoiceModel extends Model<
  Invoice,
  Optional<Invoice, 'id' | 'status' | 'recieverAccountId'>
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
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recieverAccountId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: InvoiceStatus.PENDING,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + MS_TWO_WEEKS).toString(),
    },
  },
  {
    sequelize: sequelize,
    tableName: DATABASE_PREFIX + 'invoices',
    getterMethods: {
      getDate() {
        const date = new Date(this.getDataValue('createdAt') ?? '');
        return date.toDateString();
      },
    },
  },
);

import 'reflect-metadata';
import { DataTypes } from 'sequelize';

export const timestamps = {
  createdAt: {
    type: DataTypes.DATE,
    get() {
      return new Date(this.getDataValue('createdAt') ?? '').getTime();
    },
  },
};

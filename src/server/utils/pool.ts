import { Sequelize } from 'sequelize';
import { CONNECTION_STRING } from './dbUtils';

const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');
if (mysqlConnectionString === 'none') {
  throw new Error(
    `No connection string provided. make sure "${CONNECTION_STRING}" is set in server.cfg`,
  );
}

export const sequelize = new Sequelize(mysqlConnectionString, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 60000,
  },
  sync: {
    alter: true,
    force: true,
  },
});

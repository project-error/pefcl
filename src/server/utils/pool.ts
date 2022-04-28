import { Sequelize } from 'sequelize';
import { CONNECTION_STRING, parseUri } from './dbUtils';

const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');

if (mysqlConnectionString === 'none') {
  throw new Error(
    `No connection string provided. make sure "${CONNECTION_STRING}" is set in server.cfg`,
  );
}

const config = parseUri(mysqlConnectionString);

export const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false,
  host: config.host,
  port: typeof config.port === 'string' ? parseInt(config.port, 10) : config.port,
  username: config.user,
  password: config.password,
  database: config.database,
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

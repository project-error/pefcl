import { Sequelize } from 'sequelize';
import { CONNECTION_STRING } from '../utils/dbUtils';

const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');
if (mysqlConnectionString === 'none') {
  const error = new Error(
    `No connection string provided. make sure "${CONNECTION_STRING}" is set in your config.`,
  );
  throw error;
}

export const sequelize = new Sequelize(mysqlConnectionString, {
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

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initDatabase();

/**
 * Most fivem servers utilize fivem-mysql-async (https://brouznouf.github.io/fivem-mysql-async/) and
 * define a environment variable "mysql_connection_string" in their configurations. We will try to
 * maintain backwards compatibility with this.
 *
 * fivem-mysql-async allows for two different connection string formats defined here:
 * https://brouznouf.github.io/fivem-mysql-async/config/ and we need to handle both of them.
 */
// export function generateConnectionPool() {
//   try {
//     const config = mysqlConnectionString.includes('mysql://')
//       ? { uri: mysqlConnectionString }
//       : parseSemiColonFormat(mysqlConnectionString);

//     return mysql.createPool({
//       connectTimeout: 60000,
//       ...config,
//     });
//   } catch (e) {
//     console.log('ugh');
//   }
// }

// export const pool = generateConnectionPool();

// export async function withTransaction(queries: Promise<any>[]): Promise<any[]> {
//   const connection = await pool.getConnection();
//   connection.beginTransaction();

//   try {
//     const results = await Promise.all(queries);
//     await connection.commit();
//     await connection.release();
//     return results;
//   } catch (err) {
//     await connection.rollback();
//     await connection.release();
//     return Promise.reject(err);
//   }
// }

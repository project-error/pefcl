import { ResultSetHeader } from 'mysql2';
import { singleton } from 'tsyringe';
import { Account, AccountType } from '../../../typings/accounts';
import DbInterface from '../db/db_wrapper';

@singleton()
export class AccountDB {
  async getAccounts(): Promise<Account[]> {
    const query = `SELECT account_name as accountName, balance, type, id, is_default as isDefault
                   FROM pefcl_accounts
                   ORDER BY id`;
    const [results] = await DbInterface._rawExec(query);

    return <Account[]>results;
  }

  async getAccount(id: number): Promise<Account> {
    const query = `SELECT account_name as accountName, balance, type, id, is_default as isDefault
                   FROM pefcl_accounts
                   WHERE id = ?
                   LIMIT 1`;
    const [results] = await DbInterface._rawExec(query, [id]);

    const result = <Account[]>results;

    return result[0];
  }

  async createAccount(accountName: string, identifier: string, isDefault = false): Promise<number> {
    const query = `INSERT INTO pefcl_accounts (account_name, balance, type, is_default)
                   VALUES (?, ?, ?, ?)`;
    const [results] = await DbInterface._rawExec(query, [
      accountName,
      0,
      AccountType.Personal,
      isDefault,
    ]);
    const result = results as ResultSetHeader;

    return result.insertId;
  }
}

import { singleton } from 'tsyringe';
import { Account } from '../../../typings/accounts';
import DbInterface from '../db/db_wrapper';

@singleton()
export class AccountDB {
  async getAccounts(): Promise<Account[]> {
    const query = `SELECT * FROM pefcl_accounts`;
    const [results] = await DbInterface._rawExec(query);

    return <Account[]>results;
  }
}

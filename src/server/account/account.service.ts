import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';

@singleton()
export class AccountService {
  private readonly _accountDB: AccountDB;
  constructor(accountDB: AccountDB) {
    this._accountDB = accountDB;
  }

  async handleGetAccounts() {
    return await this._accountDB.getAccounts();
  }
}

import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';
import { Request } from '../../../typings/http';
import { Account, PreDBAccount } from '../../../typings/accounts';

@singleton()
export class AccountService {
  private readonly _accountDB: AccountDB;
  constructor(accountDB: AccountDB) {
    this._accountDB = accountDB;
  }

  async handleGetAccounts() {
    return await this._accountDB.getAccounts();
  }

  async handleCreateAccount(dto: Request<PreDBAccount>): Promise<Account> {
    const accountId = await this._accountDB.createAccount(dto.data.accountName);

    return await this._accountDB.getAccount(accountId);
  }
}

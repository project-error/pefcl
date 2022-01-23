import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';
import { Request } from '../../../typings/http';
import { Account, PreDBAccount } from '../../../typings/accounts';
import { UserService } from '../user/user.service';
import { config } from '../server-config';

const exp = global.exports;

@singleton()
export class AccountService {
  private readonly _accountDB: AccountDB;
  private readonly _userService: UserService;

  constructor(accountDB: AccountDB, userService: UserService) {
    this._accountDB = accountDB;
    this._userService = userService;
  }

  async handleGetAccounts() {
    return await this._accountDB.getAccounts();
  }

  async handleCreateAccount(dto: Request<PreDBAccount>): Promise<Account> {
    const userIdentifier = this._userService.getUser(dto.source).getIdentifier();
    const accountId = await this._accountDB.createAccount(dto.data.accountName, userIdentifier);

    return await this._accountDB.getAccount(accountId);
  }

  async handleCreateDefaultAccount(source: number) {
    const userIdentifier = this._userService.getUser(source).getIdentifier();
    await this._accountDB.createAccount('Default account', userIdentifier, true);
  }

  async handleDepositMoney(req: Request<any>) {
    if (config.general.useFrameworkIntegration) {
      exp[config.exports.resourceName].FCLDepositMoney(req.source);
    }

    // do something with db on our side

    const currentBalance = this._userService.getUser(req.source).getBalance();
  }
}

import { Controller } from '../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../decorators/NetPromise';
import { Account, AccountEvents, PreDBAccount } from '../../../typings/accounts';
import { Request, Response } from '../../../typings/http';
import { AccountService } from './account.service';

@Controller('Account')
@PromiseEventListener()
export class AccountController {
  private readonly _accountService: AccountService;

  constructor(accountService: AccountService) {
    this._accountService = accountService;
  }

  @NetPromise(AccountEvents.GetAccounts)
  async getAccounts(req: Request, res: Response<Account[]>) {
    const accounts = await this._accountService.handleGetAccounts();

    res({ status: 'ok', data: accounts });
  }

  @NetPromise(AccountEvents.CreateAccount)
  async createAccount(req: Request<PreDBAccount>, res: Response<Account>) {
    try {
      const account = await this._accountService.handleCreateAccount(req);

      res({ status: 'ok', data: account });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }

  @NetPromise(AccountEvents.DeleteAccount)
  async deleteAccount(req: Request<number>, res: Response<void>) {
    res({ status: 'ok' });
  }

  // type these later when we have specs
  @NetPromise(AccountEvents.DepositMoney)
  async depositMoney(req: Request<any>, res: Response<any>) {}
}

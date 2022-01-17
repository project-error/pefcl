import { Controller } from '../decorators/Controller';
import { NetPromise } from '../decorators/NetPromise';
import { Account, AccountEvents, PreDBAccount } from '../../../typings/accounts';
import { Request, Response } from '../../../typings/http';
import { AccountService } from './account.service';

@Controller('Account')
export class AccountController {
  private readonly _accountService: AccountService;
  constructor(accountService: AccountService) {
    this._accountService = accountService;
  }

  @NetPromise(AccountEvents.GetAccounts)
  async createAccount(req: Request<void>, res: Response<Account[]>) {
    console.log('hello wiii');
    console.log(req.data);
    const accounts = await this._accountService.handleGetAccounts();
    console.log('accounts', accounts);

    res({ status: 'ok', data: accounts });
  }
}

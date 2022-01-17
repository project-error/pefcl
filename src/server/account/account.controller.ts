import { Controller } from '../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../decorators/NetPromise';
import { Account, AccountEvents } from '../../../typings/accounts';
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
  async createAccount(req: Request, res: Response<Account[]>) {
    const accounts = await this._accountService.handleGetAccounts();

    res({ status: 'ok', data: accounts });
  }
}

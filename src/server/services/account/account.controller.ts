import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { Account, AccountEvents, ATMInput, PreDBAccount } from '../../../../typings/accounts';
import { Request, Response } from '../../../../typings/http';
import { AccountService } from './account.service';
import { Event, EventListener } from '../../decorators/Event';

@Controller('Account')
@PromiseEventListener()
@EventListener()
export class AccountController {
  private readonly _accountService: AccountService;

  constructor(accountService: AccountService) {
    this._accountService = accountService;
  }

  @NetPromise(AccountEvents.GetAccounts)
  async getAccounts(req: Request<void>, res: Response<Account[]>) {
    const accounts = await this._accountService.handleGetMyAccounts(req.source);
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
  async deleteAccount(req: Request<{ accountId: number }>, res: Response<any>) {
    try {
      await this._accountService.handleDeleteAccount(req);
      res({ status: 'ok', data: {} });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }

  // type these later when we have specs
  @NetPromise(AccountEvents.DepositMoney)
  async depositMoney(req: Request<ATMInput>, res: Response<any>) {
    try {
      await this._accountService.handleDepositMoney(req);
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }
  @NetPromise(AccountEvents.WithdrawMoney)
  async withdrawMoney(req: Request<ATMInput>, res: Response<any>) {
    try {
      await this._accountService.handleWithdrawMoney(req);
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }

  @NetPromise(AccountEvents.SetDefaultAccount)
  async setDefaultAccount(req: Request<{ accountId: number }>, res: Response<any>) {
    try {
      await this._accountService.handleSetDefaultAccount(req);
      res({ status: 'ok', data: {} });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }

  /* When starting the resource / new player joining. We should handle the default account. */
  @Event('onServerResourceStart')
  async onServerResourceStart(resource: string) {
    if (resource !== GetCurrentResourceName()) {
      return;
    }

    const players = getPlayers();
    players.forEach((player) => {
      this._accountService.createInitialAccount(Number(player));
    });
  }

  /* When starting the resource / new player joining. We should handle the default account. */
  @Event('playerJoining')
  async onPlayerJoining() {
    const src = global.source;
    this._accountService.createInitialAccount(src);
  }
}

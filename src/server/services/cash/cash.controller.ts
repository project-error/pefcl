import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import { GiveCashInput } from '@typings/Cash';
import { CashEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { Controller } from '../../decorators/Controller';
import { Event, EventListener } from '../../decorators/Event';
import { CashService } from './cash.service';

@Controller('Cash')
@EventListener()
@PromiseEventListener()
export class CashController {
  _cashService: CashService;
  constructor(cashService: CashService) {
    this._cashService = cashService;
  }

  @NetPromise(CashEvents.Give)
  async giveCash(req: Request<GiveCashInput>, res: Response<boolean>) {
    try {
      const result = await this._cashService.giveCash(req);
      res({ status: 'ok', data: result });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @NetPromise(CashEvents.GetMyCash)
  async getMyCash(req: Request<void>, res: Response<number>) {
    const result = await this._cashService.getMyCash(req.source);
    res({ status: 'ok', data: result });
    return;
  }

  @Event('onServerResourceStart')
  async onServerResourceStart(resource: string) {
    if (resource !== GetCurrentResourceName()) {
      return;
    }

    const players = getPlayers();
    players.forEach((player) => {
      this._cashService.createInitialCash(Number(player));
    });
  }

  /* When starting the resource / new player joining. We should handle the default account. */
  @Event('playerJoining')
  async onPlayerJoining() {
    const src = global.source;
    this._cashService.createInitialCash(src);
  }
}

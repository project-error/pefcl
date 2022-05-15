import { Export, ExportListener } from '@decorators/Export';
import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import { config } from '@server/utils/server-config';
import { ChangeCashInput } from '@typings/Cash';
import { CashEvents, GeneralEvents } from '@typings/Events';
import { ServerExports } from '@typings/exports/server';
import { Request, Response } from '@typings/http';
import { Controller } from '../../decorators/Controller';
import { Event, EventListener } from '../../decorators/Event';
import { CashService } from './cash.service';

@Controller('Cash')
@EventListener()
@ExportListener()
@PromiseEventListener()
export class CashController {
  _cashService: CashService;
  constructor(cashService: CashService) {
    this._cashService = cashService;
  }

  @NetPromise(CashEvents.Give)
  async giveCash(req: Request<ChangeCashInput>, res: Response<boolean>) {
    try {
      const result = await this._cashService.giveCash(req);
      res({ status: 'ok', data: result });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @Export(ServerExports.AddCash)
  async addCash(req: Request<ChangeCashInput>, res: Response<boolean>) {
    try {
      await this._cashService.handleAddCash(req.data.source, req.data.amount);
      res({ status: 'ok', data: true });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @Export(ServerExports.RemoveCash)
  async removeCash(req: Request<ChangeCashInput>, res: Response<boolean>) {
    try {
      await this._cashService.handleRemoveCash(req.data.source, req.data.amount);
      res({ status: 'ok', data: true });
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

  @Event(GeneralEvents.ResourceStarted)
  async onServerResourceStart() {
    if (config?.frameworkIntegration?.enabled) return;

    const players = getPlayers();
    players.forEach((player) => {
      this._cashService.createInitialCash(Number(player));
    });
  }

  /* When starting the resource / new player joining. We should handle the default account. */
  @Event('playerJoining')
  async onPlayerJoining() {
    if (config?.frameworkIntegration?.enabled) return;
    const src = global.source;
    this._cashService.createInitialCash(src);
  }
}

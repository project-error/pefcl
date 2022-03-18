import { Controller } from '../../decorators/Controller';
import { Event, EventListener } from '../../decorators/Event';
import { CashService } from './cash.service';

@Controller('Cash')
@EventListener()
export class CashController {
  _cashService: CashService;
  constructor(cashService: CashService) {
    this._cashService = cashService;
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

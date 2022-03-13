import { Controller } from '../../decorators/Controller';
import { Event, EventListener } from '../../decorators/Event';
import { BootService } from './boot.service';

@Controller('Boot')
@EventListener()
export class BootController {
  _bootService: BootService;
  constructor(bootService: BootService) {
    this._bootService = bootService;
  }

  @Event('onServerResourceStart')
  async onServerResourceStart(resource: string) {
    if (resource !== GetCurrentResourceName()) {
      return;
    }

    this._bootService.handleResourceStart();
  }
}

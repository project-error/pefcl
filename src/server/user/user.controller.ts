import { Controller } from '../decorators/Controller';
import { EventListener, Event } from '../decorators/Event';
import { config } from '../server-config';
import { UserService } from './user.service';

@Controller('User')
@EventListener()
export class UserController {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  @Event('playerJoining')
  playerJoining(source: number) {
    console.log(`New player loaded: ${GetPlayerName(source.toString())}`);
    if (config.general.useFrameworkIntegration) return;

    this._userService.savePlayer({ source });
  }
  
  @Event('onServerResourceStart')
  async onServerResourceStart(resource: string) {
    if (resource === GetCurrentResourceName()) {
      const players = getPlayers();

      for (const player of players) {
        this._userService.savePlayer({ source: parseInt(player, 10) });
      }
    }
  }
}

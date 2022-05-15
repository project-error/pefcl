import { Controller } from '@decorators/Controller';
import { EventListener, Event } from '@decorators/Event';
import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import { config } from '@server/utils/server-config';
import { GeneralEvents, UserEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { OnlineUser } from '@typings/user';
import { BootService } from '../boot/boot.service';
import { UserService } from './user.service';

@Controller('User')
@PromiseEventListener()
@EventListener()
export class UserController {
  private readonly _userService: UserService;
  private readonly _bootService: BootService;

  constructor(userService: UserService, bootService: BootService) {
    this._userService = userService;
    this._bootService = bootService;
  }

  @NetPromise(UserEvents.GetUsers)
  async getUsers(_req: Request<void>, res: Response<OnlineUser[]>) {
    await new Promise((resolve) => {
      setImmediate(resolve);
    });

    const users = this._userService.getAllUsers();
    const list: OnlineUser[] = Array.from(users.values()).map((user) => ({
      name: user.name,
      source: user.getSource(),
      identifier: user.getIdentifier(),
    }));

    res({ status: 'ok', data: list });
  }

  @Event('playerJoining')
  playerJoining() {
    if (config.frameworkIntegration?.enabled) return;

    const _source = global.source;
    this._userService.savePlayer({ source: _source });
  }

  @Event(GeneralEvents.ResourceStarted)
  async onServerResourceStart() {
    if (config.frameworkIntegration?.enabled) return;

    const players = getPlayers();
    players.forEach((player) => {
      this._userService.savePlayer({ source: parseInt(player, 10) });
    });
  }
}

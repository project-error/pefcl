import { Controller } from '@decorators/Controller';
import { EventListener, Event } from '@decorators/Event';
import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import { UserEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { OnlineUser } from '@typings/user';
import { config } from '@utils/server-config';
import { TransactionService } from 'services/transaction/transaction.service';
import { UserService } from './user.service';

@Controller('User')
@PromiseEventListener()
@EventListener()
export class UserController {
  private readonly _userService: UserService;
  private readonly _transactionService: TransactionService;

  constructor(userService: UserService, transactionService: TransactionService) {
    this._userService = userService;
    this._transactionService = transactionService;
  }

  @NetPromise(UserEvents.GetUsers)
  async getUsers(req: Request<void>, res: Response<OnlineUser[]>) {
    // TODO: Make this return good users
    await new Promise((resolve) => {
      setImmediate(resolve);
    });

    const users = this._userService.getAllUsers();
    const list: OnlineUser[] = Array.from(users.values()).map((user) => ({
      name: user.name,
      source: user.getSource(),
      identifier: user.identifier,
    }));

    res({ status: 'ok', data: list });
  }

  @Event('playerJoining')
  playerJoining() {
    const _source = global.source;

    console.log(`New player loaded: ${GetPlayerName(_source.toString())}`);
    if (config?.general?.useFrameworkIntegration) return;

    this._userService.savePlayer({ source: _source });
  }

  @Event('onServerResourceStart')
  async onServerResourceStart(resource: string) {
    if (config?.general?.useFrameworkIntegration) return;
    if (resource === GetCurrentResourceName()) {
      const players = getPlayers();

      for (const player of players) {
        this._userService.savePlayer({ source: parseInt(player, 10) });
      }
    }
  }
}

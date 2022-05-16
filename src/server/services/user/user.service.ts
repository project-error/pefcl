import { GenericErrors } from '@typings/Errors';
import { ServerError } from '@utils/errors';
import { mainLogger } from '@server/sv_logger';
import { singleton } from 'tsyringe';
import { OnlineUser, UserDTO } from '../../../../typings/user';
import { getPlayerIdentifier, getPlayerName } from '../../utils/misc';
import { UserModule } from './user.module';
import { UserEvents } from '@server/../../typings/Events';

const logger = mainLogger.child({ module: 'user' });

@singleton()
export class UserService {
  private readonly usersBySource: Map<number, UserModule>; // Player class
  constructor() {
    this.usersBySource = new Map<number, UserModule>();
  }

  getAllUsers() {
    return this.usersBySource;
  }

  getUser(source: number): UserModule {
    const user = this.usersBySource.get(source);

    if (!user) {
      throw new ServerError(GenericErrors.UserNotFound);
    }

    return user;
  }

  getUserByIdentifier(identifier: string): UserModule | undefined {
    let user: UserModule | undefined;

    this.getAllUsers().forEach((onlineUser) => {
      user = onlineUser.getIdentifier() === identifier ? onlineUser : user;
    });

    return user;
  }

  /**
   * Used when the player is unloaded or dropped.
   * @param source
   */
  deletePlayer(source: number) {
    this.usersBySource.delete(source);
  }

  async loadPlayer(data: OnlineUser) {
    logger.debug('Loading player for pefcl with export');
    logger.debug(data);

    const user = new UserModule(data);
    this.usersBySource.set(user.getSource(), user);

    emit(UserEvents.Loaded, data);
  }

  async savePlayer(userDTO: UserDTO) {
    const identifier = getPlayerIdentifier(userDTO.source);
    const name = getPlayerName(userDTO.source);

    const user = new UserModule({
      name,
      identifier,
      source: userDTO.source,
    });

    logger.debug('New user loaded for pe-fcl');
    logger.debug(user);

    this.usersBySource.set(userDTO.source, user);
    emit(UserEvents.Loaded, {
      name,
      identifier,
      source: userDTO.source,
    });
  }
}

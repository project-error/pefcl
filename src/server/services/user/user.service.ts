import { GenericErrors } from '@typings/Errors';
import { ServerError } from '@utils/errors';
import { mainLogger } from 'sv_logger';
import { singleton } from 'tsyringe';
import { UserDTO } from '../../../../typings/user';
import { getGameLicense } from '../../utils/misc';
import { UserModule } from './user.module';

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

  /**
   * Used when the player is unloaded or dropped.
   * @param source
   */
  deletePlayer(source: number) {
    this.usersBySource.delete(source);
  }

  savePlayer(userDTO: UserDTO) {
    if (!userDTO.identifier) {
      userDTO.identifier = getGameLicense(userDTO.source);
    }

    if (!userDTO.name) {
      userDTO.name = GetPlayerName(userDTO.source.toString());
    }

    if (!userDTO.identifier) {
      logger.error('User could not be saved. Missing identifier.');
      logger.error(userDTO);
      return;
    }

    const user = new UserModule({
      source: userDTO.source,
      identifier: userDTO.identifier,
      name: userDTO.name,
    });

    logger.debug('New user loaded for pe-fcl', user);

    this.usersBySource.set(userDTO.source, user);
  }
}

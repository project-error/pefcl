import { singleton } from 'tsyringe';
import { User, UserDTO } from '../../../typings/user';
import { getGameLicense } from '../utils/miscUtils';
import { UserModule } from './user.module';

@singleton()
export class UserService {
  private readonly playersBySource: Map<number, UserModule>; // Player class
  constructor() {
    this.playersBySource = new Map<number, UserModule>();
  }

  getPlayer(source: number) {
    return this.playersBySource.get(source);
  }

  /**
   * Used when the player is unloaded or dropped.
   * @param source
   */
  deletePlayer(source: number) {
    this.playersBySource.delete(source);
  }

  savePlayer(userDTO: UserDTO) {
    if (!userDTO.identifier) {
      userDTO.identifier = getGameLicense(userDTO.source);
    }

    const user = new UserModule({ source: userDTO.source, identifier: userDTO.identifier });

    this.playersBySource.set(source, user);
  }
}

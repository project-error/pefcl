import { singleton } from 'tsyringe';
import { UserDTO } from '../../../../typings/user';
import { getGameLicense } from '../../utils/miscUtils';
import { UserModule } from './user.module';

@singleton()
export class UserService {
  private readonly usersBySource: Map<number, UserModule>; // Player class
  constructor() {
    this.usersBySource = new Map<number, UserModule>();
  }

  getAllUsers() {
    return this.usersBySource;
  }

  getUser(source: number) {
    return this.usersBySource.get(source);
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

    const user = new UserModule({ source: userDTO.source, identifier: userDTO.identifier });
    console.log('New user loaded for pe-fcl', user);

    this.usersBySource.set(userDTO.source, user);
  }
}

import { singleton } from 'tsyringe';
import { sequelize } from '../../utils/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';

const logger = mainLogger.child({ module: 'boot' });

@singleton()
export class BootService {
  _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  async handleResourceStart() {
    logger.debug('Checking database connection ...');
    await sequelize.authenticate();
    logger.debug('Connected!');
  }
}

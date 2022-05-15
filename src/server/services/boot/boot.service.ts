import { singleton } from 'tsyringe';
import { sequelize } from '../../utils/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { getFrameworkExports, validateResourceExports } from '@server/utils/frameworkIntegration';
import { config } from '@server/utils/server-config';
import { GeneralEvents } from '@server/../../typings/Events';
import { resourceName } from '@server/utils/constants';

const logger = mainLogger.child({ module: 'boot' });

@singleton()
export class BootService {
  _userService: UserService;
  isReady = false;
  onReady: Promise<boolean>;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  private checkExports(): boolean {
    if (config?.frameworkIntegration?.enabled) {
      logger.info('Framework integration is enabled.');
      const resourceExports = getFrameworkExports();

      if (!validateResourceExports(resourceExports)) {
        return false;
      }
    }

    return true;
  }

  async handleResourceStart() {
    logger.debug('Checking database connection ..');
    await sequelize.authenticate();
    logger.debug('Connected to database.');

    const isValid = this.checkExports();

    if (!isValid) {
      logger.error(`Stopped ${resourceName} because of invalid framework exports.`);
      this.handleResourceStop();
      return;
    }

    logger.info(`Starting ${resourceName}.`);
    emit(GeneralEvents.ResourceStarted);
  }

  async handleResourceStop() {
    logger.info(`Stopping ${resourceName}.`);
    emit(GeneralEvents.ResourceStopped);
  }
}

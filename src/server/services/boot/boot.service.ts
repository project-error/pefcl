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

  private checkExports() {
    const resourceExports = getFrameworkExports();

    if (!validateResourceExports(resourceExports)) {
      throw new Error('Framework integration failed');
    }
  }

  async handleResourceStart() {
    logger.debug('Checking database connection ..');
    await sequelize.authenticate();
    logger.debug('Connected to database.');

    if (config?.frameworkIntegration?.enabled) {
      logger.info('Framework integration is enabled.');

      try {
        logger.debug('Verifying exports ..');
        this.checkExports();
      } catch (error: unknown | Error) {
        logger.error('Stopping resource due to framework integration error. Reason:');
        logger.error(error);

        if (error instanceof Error && error.message.includes('No such export')) {
          if (config.frameworkIntegration.isCardsEnabled && error.message.includes('Card')) {
            logger.error(' ');
            logger.error(
              'This framework does not seem to support cards. Make sure your resource is exporting the required exports!',
            );
            logger.error(
              'Check the documentation for correct setup: https://projecterror.dev/docs/pefcl/developers/framework_integration',
            );
            logger.error(' ');
          } else {
            logger.error(
              'Check your starting order. The framework integration library needs to be started before PEFCL!',
            );
          }
        }

        this.handleResourceStop();
        return;
      }

      logger.info('Successfully verified exports.');
    }

    logger.info(`Starting ${resourceName}.`);
    emit(GeneralEvents.ResourceStarted);
  }

  async handleResourceStop() {
    logger.info(`Stopping ${resourceName}.`);
    emit(GeneralEvents.ResourceStopped);
    StopResource(resourceName);
    StopResource(resourceName);
    StopResource(resourceName);
    StopResource(resourceName);
  }
}

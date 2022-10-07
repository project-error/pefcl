import {
  FrameworkIntegrationExports,
  FrameworkIntegrationFunction,
} from '@server/../../typings/exports';
import { mainLogger } from '@server/sv_logger';
import { getExports } from './misc';
import { config } from './server-config';

const logger = mainLogger.child({ module: 'frameworkIntegration' });

const frameworkIntegrationKeys: FrameworkIntegrationFunction[] = [
  'addCash',
  'removeCash',
  'getCash',
  'getBank',
];

if (config?.frameworkIntegration?.isCardsEnabled) {
  frameworkIntegrationKeys.push('giveCard');
  frameworkIntegrationKeys.push('getCards');
}

export const validateResourceExports = (resourceExports: FrameworkIntegrationExports): boolean => {
  let isValid = true;
  frameworkIntegrationKeys.forEach((key: FrameworkIntegrationFunction) => {
    logger.silly(`Verifying export: ${key}`);
    if (typeof resourceExports[key] === 'undefined') {
      logger.error(`Framework integration export ${key} is missing.`);
      isValid = false;
      return;
    }

    if (typeof resourceExports[key] !== 'function') {
      logger.error(`Framework integration export ${key} is not a function.`);
      isValid = false;
    }
  });

  return isValid;
};

export const getFrameworkExports = (): FrameworkIntegrationExports => {
  const exps = getExports();
  const resourceName = config?.frameworkIntegration?.resource;
  const resourceExports: FrameworkIntegrationExports = exps[resourceName ?? ''];

  logger.debug(`Checking exports from resource: ${resourceName}`);

  if (!resourceName) {
    logger.error(`Missing resourceName in the config for framework integration`);
    throw new Error('Framework integration failed');
  }

  if (!resourceExports) {
    logger.error(
      `No resource found with name: ${resourceName}. Make sure you have the correct resource name in the config.`,
    );
    throw new Error('Framework integration failed');
  }

  return resourceExports;
};

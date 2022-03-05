import { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from './misc';
import defaultConfig from '../../../config.json';

export const getConfig = async (): Promise<ResourceConfig> => {
  if (isEnvBrowser()) {
    return defaultConfig;
  }

  const resourceName = getResourceName();
  const config = await fetch(`https://cfx-nui-${resourceName}/config.json`).then((res) =>
    res.json(),
  );

  return config;
};

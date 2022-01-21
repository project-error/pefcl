import { getResourceName, isEnvBrowser } from '../utils/misc';
import { useSetConfig } from '../states/bank';
import { useEffect } from 'react';

export const useConfig = () => {
  const setConfig = useSetConfig();

  useEffect(() => {
    if (isEnvBrowser()) return;
    const resourceName = getResourceName();

    fetch(`https://cfx-nui-${resourceName}/config.json`).then(async (res) => {
      const config = await res.json();
      setConfig(config);
    });
  }, [setConfig]);
};

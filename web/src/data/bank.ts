import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from '../utils/misc';
import MockConfig from '../config/default.json';

export const bankState = {
  resourceConfig: atom<ResourceConfig>({
    key: 'bankResourceConfig',
    default: selector({
      key: 'defaultBankResourceConfigValue',
      get: async () => {
        try {
          const resourceName = getResourceName();
          const res = await fetch(`https://cfx-nui-${resourceName}/config.json`);

          return await res.json();
        } catch (err) {
          if (isEnvBrowser()) {
            console.log('is browser');
            return MockConfig;
          }
          console.error(err);
          return null;
        }
      },
    }),
  }),
};

export const useConfigValue = () => useRecoilValue(bankState.resourceConfig);
export const useSetConfig = () => useSetRecoilState(bankState.resourceConfig);

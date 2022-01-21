import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from '../utils/misc';

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
            return null;
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

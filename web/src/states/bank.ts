import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { ResourceConfig } from '../../../typings/config';

export const bankState = {
  resourceConfig: atom<ResourceConfig>({
    key: 'bankResourceConfig',
    default: null,
  }),
};

export const useConfigValue = () => useRecoilValue(bankState.resourceConfig);
export const useSetConfig = () => useSetRecoilState(bankState.resourceConfig);

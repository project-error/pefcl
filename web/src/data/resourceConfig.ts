import { atom } from 'jotai';
import { ResourceConfig } from '@typings/config';
import { getConfig } from '../utils/api';

export const configAtom = atom<Promise<ResourceConfig>>(async () => {
  return await getConfig();
});

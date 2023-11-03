import { LbPhoneSettings } from '@typings/LbPhone';
import { atom } from 'jotai';

export const lbPhoneSettingsAtom = atom<Promise<LbPhoneSettings | null>>(async () => {
  return window.GetSettings != null ? await window.GetSettings() : null;
});
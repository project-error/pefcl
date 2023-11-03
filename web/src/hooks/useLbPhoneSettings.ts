import { useAtom } from 'jotai';
import { LbPhoneSettings } from '@typings/LbPhone';
import { lbPhoneSettingsAtom } from '@data/lbPhoneSettings';

export const useLbPhoneSettings = (): LbPhoneSettings | null => {
  const [settings] = useAtom(lbPhoneSettingsAtom);
  return settings;
};
import { useEffect } from 'react';
import { fetchNui } from '../utils/fetchNui';
import { GeneralEvents } from '@typings/accounts';
import { isEnvBrowser } from '@utils/misc';

const LISTENED_KEYS = ['Escape', 'Backspace'];

export const useExitListener = () => {
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (LISTENED_KEYS.includes(e.code) && !isEnvBrowser()) {
        fetchNui(GeneralEvents.CloseBank);
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, []);
};

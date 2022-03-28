import { useEffect } from 'react';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { GeneralEvents } from '@typings/Events';

const LISTENED_KEYS = ['Escape'];

export const useExitListener = () => {
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (LISTENED_KEYS.includes(e.code) && !isEnvBrowser()) {
        fetchNui(GeneralEvents.CloseUI);
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, []);
};

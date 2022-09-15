import { useEffect } from 'react';

export const useKeyDown = (keys: string[], callback: () => void) => {
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (keys.includes(e.code)) {
        callback();
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [keys, callback]);
};

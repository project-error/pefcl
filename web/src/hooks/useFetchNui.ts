import { fetchNui } from '@utils/fetchNui';
import { useEffect, useState } from 'react';
import { usePrevious } from './usePrevious';

export const useFetchNui = <T>(event: string, options?: object) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();

  const previous = usePrevious(JSON.stringify(options));
  const hasChanged = JSON.stringify(options) !== previous;

  useEffect(() => {
    setIsLoading(true);
    fetchNui<T>(event, options)
      .then(setData)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, hasChanged]);

  return { isLoading, data, error };
};

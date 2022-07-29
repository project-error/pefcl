import { fetchNui } from '@utils/fetchNui';
import { useEffect, useState } from 'react';

export const useFetchNui = <T>(event: string) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();

  useEffect(() => {
    setIsLoading(true);
    fetchNui<T>(event)
      .then(setData)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [event]);

  return { isLoading, data, error };
};

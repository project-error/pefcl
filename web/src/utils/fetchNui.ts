import { getResourceName } from './misc';

export const fetchNui = async <T = any>(eventName: string, data?: any): Promise<T | undefined> => {
  const resourceName = getResourceName();
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(`https://${resourceName}/${eventName}`, options);
  const response = await res.json();

  return response;
};

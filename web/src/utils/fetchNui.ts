import { getResourceName } from './misc';

const isDevelopment = process.env.NODE_ENV === 'development';

export const fetchNui = async <T = any>(eventName: string, data?: any): Promise<T | undefined> => {
  const resourceName = getResourceName();
  const url = isDevelopment
    ? `http://localhost:3005/${eventName.replace(':', '-')}`
    : `https://${resourceName}/${eventName}`;

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, options);
  const response = await res.json();

  return response.data;
};

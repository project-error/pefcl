import { getResourceName } from './misc';
import { ServerPromiseResp } from '@typings/http';

const isDevelopment = process.env.NODE_ENV === 'development';

export const fetchNui = async <T = object, I = object>(
  eventName: string,
  data?: I,
): Promise<T | undefined> => {
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
  const response: ServerPromiseResp<T> = await res.json();

  if (response.status === 'error') {
    throw new Error(response.errorMsg);
  }

  return response.data;
};

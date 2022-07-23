import { DEFAULT_CLEARING_NUMBER } from './constants';
import { config } from './server-config';

const isMocking = process.env.NODE_ENV === 'mocking';

export const getExports = () => {
  if (!isMocking) {
    return global.exports;
  }

  return typeof global.exports === 'function' ? global.exports() : global.exports;
};

export const getSource = (): number => global.source;

export const getPlayerIdentifier = (source: number): string => {
  const identifiers = getPlayerIdentifiers(source.toString());

  if (config.debug?.mockLicenses) {
    return `license:${source}`;
  }

  const identifierType = config.general?.identifierType ?? 'license';
  const identifier = identifiers.find((identifier) => identifier.includes(`${identifierType}:`));

  if (!identifier) {
    throw new Error('Failed to get identifier for player' + source);
  }

  return identifier;
};

export const getPlayerName = (source: number): string => {
  return GetPlayerName(source.toString());
};

export const getClearingNumber = (initialConfig = config): string => {
  const configValue = initialConfig?.accounts?.clearingNumber ?? DEFAULT_CLEARING_NUMBER;
  const confValue = typeof configValue === 'string' ? configValue : configValue.toString();

  if (confValue.length !== 3) {
    return DEFAULT_CLEARING_NUMBER.toString();
  }

  return confValue;
};

export const generateAccountNumber = (clearingNumber = getClearingNumber()): string => {
  const initialNumber = clearingNumber;

  let uuid = `${initialNumber},`;
  for (let i = 0; i < 12; i++) {
    switch (i) {
      case 8:
        uuid += '-';
        uuid += ((Math.random() * 4) | 0).toString();
        break;
      case 4:
        uuid += '-';
        uuid += ((Math.random() * 4) | 0).toString();
        break;
      default:
        uuid += ((Math.random() * 9) | 0).toString(10);
    }
  }

  return uuid;
};

// Credits to d0p3t
// https://github.com/d0p3t/fivem-js/blob/master/src/utils/UUIDV4.ts
export const uuidv4 = (): string => {
  let uuid = '';
  for (let ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        uuid += ((Math.random() * 16) | 0).toString(16);
        break;
      case 12:
        uuid += '-';
        uuid += '4';
        break;
      case 16:
        uuid += '-';
        uuid += ((Math.random() * 4) | 8).toString(16);
        break;
      default:
        uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }
  return uuid;
};

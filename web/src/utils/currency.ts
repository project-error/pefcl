import { ResourceConfig } from '../../../typings/config';

type FormatMoneyOptions = {
  currency: string;
  language: string;
};

export const formatMoney = (amount: number, options: FormatMoneyOptions) => {
  const formatter = new Intl.NumberFormat(options.language, {
    style: 'currency',
    currency: options.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const formatMoneyWithoutCurrency = (amount: number, language: string) => {
  const formatter = new Intl.NumberFormat(language);
  return formatter.format(amount);
};

export const getSignLocation = (config: ResourceConfig): 'before' | 'after' => {
  const formatter = new Intl.NumberFormat(config?.general?.language, {
    style: 'currency',
    currency: config.general.currency,
  });

  const result = formatter.format(0);
  const isBefore = result.charAt(0) !== '0';

  return isBefore ? 'before' : 'after';
};

export const getCurrencySign = (config: ResourceConfig): string => {
  const formatter = new Intl.NumberFormat(config.general.language, {
    style: 'currency',
    currency: config.general.currency,
  });

  const [result] = formatter.formatToParts(0).filter((part) => part.type === 'currency');

  return result.value;
};

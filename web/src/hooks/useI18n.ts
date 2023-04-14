import { Language } from '@utils/i18nResourceHelpers';
import { i18n } from 'i18next';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { loadPefclResources } from 'src/views/Mobile/i18n';

dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);

export const useI18n = (initialI18n: i18n, language: Language) => {
  const [i18n, setI18n] = useState<i18n>();

  const changeLanguage = useCallback(
    (language: Language) => {
      if (!i18n) {
        throw new Error('Cannot change language before i18n has been loaded.');
      }

      /* Change language for i18n */
      i18n.changeLanguage(language);

      /* Import locale for DayJS, then update translations & set locale */
      import(`dayjs/locale/${language}.js`).then(() => {
        dayjs.locale(language);
        dayjs.updateLocale(language, {
          calendar: {
            lastDay: i18n.t('calendar.lastDay'),
            sameDay: i18n.t('calendar.sameDay'),
            nextDay: i18n.t('calendar.nextDay'),
            lastWeek: i18n.t('calendar.lastWeek'),
            nextWeek: i18n.t('calendar.nextWeek'),
            sameElse: i18n.t('calendar.sameElse'),
          },
        });
      });
    },
    [i18n],
  );

  useEffect(() => {
    if (i18n) {
      changeLanguage(language);
    }
  }, [changeLanguage, i18n, language]);

  useEffect(() => {
    console.log('here!', initialI18n);
    const instance = initialI18n.cloneInstance();
    console.log('we cloned');
    loadPefclResources(instance);
    console.log('next up...');
    setI18n(instance);
    console.log('we did it!');
  }, [initialI18n]);

  return { i18n: i18n, changeLanguage };
};

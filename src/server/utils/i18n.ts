import en from '@locales/en/translation.json';
import sv from '@locales/sv/translation.json';
import 'dayjs/locale/sv';
import dayjs from 'dayjs';
import i18next from 'i18next';
import { config } from '@utils/server-config';
import { mainLogger } from 'sv_logger';

const language = config.language ?? 'en';
const logger = mainLogger.child({ module: 'i18n' });

dayjs.locale(language);

export const load = async () => {
  logger.debug('Loading language from config: ' + language);

  await i18next
    .init({
      resources: {
        en: {
          translation: en,
        },
        sv: {
          translation: sv,
        },
      },
      lng: language,
      fallbackLng: 'en',
    })
    .catch((r) => console.error(r));
};

export type TranslateFunction = typeof i18next['t'];

export default i18next;

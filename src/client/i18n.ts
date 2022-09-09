import languages from '@locales/index';

export type Namespace = 'translation' | 'pefcl';
export type LanguageContent = typeof languages['en'];
export type Language = keyof typeof languages;
export type Locale = Record<Language, LanguageContent>;
export type Resource = Record<Language, Record<Namespace, LanguageContent>>;

import cl_config from 'cl_config';
import i18next from 'i18next';

export const getI18nResourcesNamespaced = (namespace: Namespace) => {
  return Object.keys(languages).reduce((prev, key) => {
    return {
      ...prev,
      [key]: {
        [namespace]: languages[key as Language],
      },
    };
  }, {} as Resource);
};

const language = cl_config.general?.language;
export const load = async () => {
  console.debug('Loading language from config: ' + language);
  const resources = getI18nResourcesNamespaced('translation');

  await i18next
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
    })
    .catch((r) => console.error(r));
};

load();

export const translations = i18next;

export default i18next;

import languages from '@locales/index';

export type Namespace = 'translation' | 'pefcl';
export type LanguageContent = typeof languages['en'];
export type Language = keyof typeof languages;
export type Locale = Record<Language, LanguageContent>;
export type Resource = Record<Language, Record<Namespace, LanguageContent>>;

export const getI18nResources = () => {
  return languages;
};

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

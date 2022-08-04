import languages from '@locales/index';

export type Namespace = 'translation' | 'pefcl';
export type LanguageContent = typeof languages['en'];
export type Language = keyof typeof languages;
export type Locale = Record<Language, LanguageContent>;
export type Resource = Record<Language, Record<Namespace, LanguageContent>>;

export const getI18nResources = () => {
  return Object.keys(languages).reduce((prev, key) => {
    return {
      ...prev,
      [key]: {
        translation: languages[key as Language],
      },
    };
  }, {} as Resource);
};

import { i18n } from 'i18next';
import en from '@locales/en/default.json';
import sv from '@locales/sv/default.json';

export const loadPefclResources = (i18n: i18n) => {
  i18n.addResourceBundle('en', 'pefcl', en);
  i18n.addResourceBundle('sv', 'pefcl', sv);

  return i18n;
};

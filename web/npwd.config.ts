import App from './src/Mobile';

const defaultLanguage = 'en';
const localizedAppName = {
  en: 'Very good bank, fleeca suck',
};

interface Settings {
  language: 'en';
}

export default (settings: Settings) => ({
  id: 'BANK',
  nameLocale: localizedAppName[settings?.language ?? defaultLanguage],
  color: '#fff',
  backgroundColor: '#333',
  path: '/bank',
  icon: () => 'lol',
  app: App,
});

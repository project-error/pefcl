import App from './src/views/Mobile/Mobile';
import BankIcon from './src/BankIcon';

// const defaultLanguage = 'en';
// const localizedAppName = {
//   en: 'APPS_BANK',
// };

// interface Settings {
//   language: 'en';
// }

export const externalAppConfig = () => ({
  id: 'BANK',
  nameLocale: 'BANK',
  color: '#fff',
  backgroundColor: '#264f82',
  path: '/bank',
  icon: BankIcon,
  notificationIcon: BankIcon,
  app: App,
});

export default externalAppConfig;

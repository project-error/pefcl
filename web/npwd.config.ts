import App from './src/Mobile';
import BankIcon from './src/BankIcon';

// const defaultLanguage = 'en';
// const localizedAppName = {
//   en: 'APPS_BANK',
// };

// interface Settings {
//   language: 'en';
// }

export default () => ({
  id: 'BANK',
  nameLocale: 'BANK',
  color: '#fff',
  backgroundColor: '#264f82',
  path: '/bank',
  icon: BankIcon,
  app: App,
});

if (module.hot) {
  module.hot.accept('./src/Mobile', function () {
    console.log('Accepting the updated app from PEFCL ..');
    window.postMessage({ type: 'RELOAD', payload: 'app:pefcl' }, '*');
  });
}

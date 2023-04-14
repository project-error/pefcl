import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from './utils/theme';
import { HashRouter } from 'react-router-dom';
import i18n from './utils/i18n';
import { SnackbarProvider } from 'notistack';
import { NuiProvider } from 'react-fivem-hooks';
import { I18nextProvider } from 'react-i18next';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';

ReactDOM.render(
  <React.StrictMode>
    <NuiProvider>
      <GlobalSettingsProvider isMobile={false}>
        <I18nextProvider i18n={i18n}>
          <HashRouter>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={2}>
                <React.Suspense fallback={<div>Fetching app</div>}>
                  <App />
                </React.Suspense>
              </SnackbarProvider>
            </ThemeProvider>
          </HashRouter>
        </I18nextProvider>
      </GlobalSettingsProvider>
    </NuiProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

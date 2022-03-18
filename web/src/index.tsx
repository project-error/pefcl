import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from './utils/theme';
import { RecoilRoot } from 'recoil';
import { HashRouter } from 'react-router-dom';
import './translation/i18n';
import { SnackbarProvider } from 'notistack';
import { NuiProvider } from 'react-fivem-hooks';

ReactDOM.render(
  <React.StrictMode>
    <NuiProvider>
      <HashRouter>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <React.Suspense fallback={null}>
              <SnackbarProvider maxSnack={2}>
                <App />
              </SnackbarProvider>
            </React.Suspense>
          </ThemeProvider>
        </RecoilRoot>
      </HashRouter>
    </NuiProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

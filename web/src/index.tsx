import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from './theming/theme';
import { RecoilRoot } from 'recoil';
import { HashRouter } from 'react-router-dom';
import './translation/i18n';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <React.Suspense fallback={null}>
            <App />
          </React.Suspense>
        </ThemeProvider>
      </RecoilRoot>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

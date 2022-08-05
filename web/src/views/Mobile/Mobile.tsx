import React from 'react';
import './mobile.module.css';
import styled from 'styled-components';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { ThemeProvider } from '@mui/material';
import { i18n } from 'i18next';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import { useI18n } from '@hooks/useI18n';
import { Language } from '@utils/i18nResourceHelpers';

const Container = styled.div`
  color: #fff;
  background: ${theme.palette.background.default};
  overflow: auto;
  height: 100%;
  padding-bottom: ${FooterHeight};
`;

interface MobileAppProps {
  i18n: i18n;
  settings: {
    language: {
      label: string;
      value: Language;
    };
  };
}

const MobileApp = (props: MobileAppProps) => {
  const lng = props.settings.language.value;
  const { i18n } = useI18n(props.i18n, lng);

  if (!i18n) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n} defaultNS="pefcl">
        <React.Suspense fallback="Loading PEFCL ..">
          <Container>
            <MobileRoutes isNpwdLoaded />
            <MobileFooter isNpwdLoaded />
          </Container>
        </React.Suspense>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default MobileApp;

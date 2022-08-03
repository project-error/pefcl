import React, { useEffect, useState } from 'react';
import './mobile.module.css';
import styled from 'styled-components';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { ThemeProvider } from '@mui/material';
import { i18n } from 'i18next';
import './i18n';
import { loadPefclResources } from './i18n';
import { I18nextProvider } from 'react-i18next';

const Container = styled.div`
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
      value: string;
    };
  };
}

const MobileApp = (props: MobileAppProps) => {
  const [i18nInstance, setI18nInstance] = useState<i18n>();
  const lng = props.settings.language.value;

  useEffect(() => {
    const instance = props.i18n.cloneInstance({ lng });
    loadPefclResources(instance);
    setI18nInstance(instance);
  }, [props.i18n, lng]);

  if (!i18nInstance) {
    return 'No i18n instance created';
  }

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18nInstance} defaultNS="pefcl">
        <Container>
          <MobileRoutes isNpwdLoaded />
          <MobileFooter isNpwdLoaded />
        </Container>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default MobileApp;

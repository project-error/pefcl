import React from 'react';
import './mobile.module.css';
import styled from 'styled-components';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { CircularProgress, Stack, ThemeProvider } from '@mui/material';
import { i18n } from 'i18next';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import { useI18n } from '@hooks/useI18n';
import { Language } from '@utils/i18nResourceHelpers';
import { Box } from '@mui/system';
import { Heading6 } from '@components/ui/Typography/Headings';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';

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

interface LoadingFallbackProps {
  message: string;
}

const LoadingFallback = (props: LoadingFallbackProps) => (
  <Box
    p={4}
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Stack spacing={3} alignItems="center">
      <CircularProgress size={120} />
      <Heading6>{props.message}</Heading6>
    </Stack>
  </Box>
);

const MobileApp = (props: MobileAppProps) => {
  const lng = props.settings.language.value;
  const { i18n } = useI18n(props.i18n, lng);

  if (!i18n) {
    return null;
  }

  return (
    <GlobalSettingsProvider isMobile>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n} defaultNS="pefcl">
          <Container>
            <React.Suspense fallback={<LoadingFallback message={i18n.t('Fetching data ..')} />}>
              <MobileRoutes />
            </React.Suspense>
            <MobileFooter />
          </Container>
        </I18nextProvider>
      </ThemeProvider>
    </GlobalSettingsProvider>
  );
};

export default MobileApp;

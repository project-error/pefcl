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
import { Box } from '@mui/system';
import { Heading6 } from '@components/ui/Typography/Headings';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';
import { IPhoneSettings } from '@project-error/npwd-types';
import { BroadcastsWrapper } from '@hooks/useBroadcasts';
import { MemoryRouter } from 'react-router-dom';

const Container = styled.div`
  color: #fff;
  background: ${theme.palette.background.default};
  overflow: auto;
  height: 100%;
  padding-bottom: ${FooterHeight};
`;

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

interface MobileAppProps {
  i18n: i18n;
  settings: IPhoneSettings;
}

const MobileApp = (props: MobileAppProps) => {
  console.log('APP PROPS', props);

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
            <MemoryRouter
              initialEntries={[
                '/bank/dashboard',
                '/bank/accounts',
                '/bank/transfer',
                '/bank/invoices',
              ]}
              initialIndex={0}
            >
              <React.Suspense fallback={<LoadingFallback message={i18n.t('Fetching data ..')} />}>
                <MobileRoutes />
              </React.Suspense>
              <MobileFooter />
            </MemoryRouter>
          </Container>

          {/* We don't need to show any fallback for the update component since it doesn't render anything anyway. */}
          <React.Suspense fallback={null}>{<BroadcastsWrapper />}</React.Suspense>
        </I18nextProvider>
      </ThemeProvider>
    </GlobalSettingsProvider>
  );
};

export default MobileApp;

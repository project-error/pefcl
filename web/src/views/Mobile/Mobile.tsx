import React, { useEffect, useState } from 'react';
import './mobile.module.css';
import styled from 'styled-components';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { CircularProgress, Stack, ThemeProvider } from '@mui/material';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/sv';
import { i18n } from 'i18next';
import './i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useI18n } from '@hooks/useI18n';
import { Box } from '@mui/system';
import { Heading6 } from '@components/ui/Typography/Headings';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';
import { IPhoneSettings } from '@project-error/npwd-types';
import { BroadcastsWrapper } from '@hooks/useBroadcasts';
import { useConfig } from '@hooks/useConfig';

const Container = styled.div`
  color: #fff;
  background: ${theme.palette.background.default};
  overflow: auto;
  height: 100%;
  padding-top: 42px;
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

const MobileApp = () => {
  const { i18n } = useTranslation();
  const config = useConfig();

  useEffect(() => {
    i18n.changeLanguage(config?.general?.language).catch((e) => console.error(e));
  }, [i18n, config]);

  useEffect(() => {
    dayjs.locale(config?.general?.language ?? 'en');
  }, [i18n, config]);

  // const lng = props.settings.language.value;
  // const { i18n } = useI18n(props.i18n, 'en');

  if (!i18n) {
    return null;
  }

  return (
    <>
      <Container>
        <React.Suspense fallback={<LoadingFallback message={'Getting data..'} />}>
          <MobileRoutes />
        </React.Suspense>
        <MobileFooter />
      </Container>

      {/* We don't need to show any fallback for the update component since it doesn't render anything anyway. */}
      <React.Suspense fallback={null}>{<BroadcastsWrapper />}</React.Suspense>
    </>
  );
};

export default MobileApp;

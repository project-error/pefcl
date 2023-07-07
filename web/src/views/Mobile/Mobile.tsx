import React from 'react';
import './mobile.module.css';
import styled from 'styled-components';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { CircularProgress, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { Heading6 } from '@components/ui/Typography/Headings';

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
  return (
    <>
      <Container>
        <React.Suspense fallback={<LoadingFallback message={'Getting data...'} />}>
          <MobileRoutes />
        </React.Suspense>
        <MobileFooter />
      </Container>
    </>
  );
};

export default MobileApp;

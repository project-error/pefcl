import i18n from '@utils/i18n';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import './mobile.module.css';
import styled from 'styled-components';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';

const Container = styled.div`
  color: white;
  background: ${theme.palette.background.default};
  overflow: auto;
  height: 100%;
  padding-bottom: ${FooterHeight};
`;

const MobileApp = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Container>
        <MobileRoutes />
        <MobileFooter />
      </Container>
    </I18nextProvider>
  );
};

export default MobileApp;

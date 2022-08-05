import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from 'react-router-dom';
import styled from 'styled-components';
import image from './bg.png';
import { NuiProvider } from 'react-fivem-hooks';
import MobileApp from './views/Mobile/Mobile';
import i18n from '@utils/i18n';

const Container = styled.div`
  position: relative;
  width: 500px;
  height: 1000px;
`;
const Background = styled.div<{ src: string }>`
  z-index: 10;
  background: url(${({ src }) => src});
  position: absolute;
  width: 500px;
  height: 1000px;
  pointer-events: none;
`;

const AppContainer = styled.div`
  z-index: 2;
  position: absolute;
  bottom: 100px;
  left: 50px;
  right: 50px;
  top: 100px;
  display: flex;
  flex-direction: column;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 20px;
`;

const Root = () => (
  <HashRouter>
    <NuiProvider>
      <Container>
        <Background src={image} />
        <React.Suspense fallback="Loading phone">
          <AppContainer>
            <MobileApp settings={{ language: { label: 'Svenska', value: 'sv' } }} i18n={i18n} />
          </AppContainer>
        </React.Suspense>
      </Container>
    </NuiProvider>
  </HashRouter>
);

ReactDOM.render(<Root />, document.getElementById('mobile-app'));

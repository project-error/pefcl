import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from 'react-router-dom';
import styled from 'styled-components';
import image from './bg.png';
import { NuiProvider } from 'react-fivem-hooks';
import MobileApp from './views/Mobile/Mobile';
import i18n from '@utils/i18n';
import { IPhoneSettings } from '@project-error/npwd-types';

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

const mockedSetting = {
  label: 'idk',
  value: 'idk',
};
const mockedSettings: IPhoneSettings = {
  language: mockedSetting,
  iconSet: mockedSetting,
  wallpaper: mockedSetting,
  frame: mockedSetting,
  theme: mockedSetting,
  zoom: mockedSetting,
  streamerMode: false,
  ringtone: mockedSetting,
  callVolume: 0,
  notiSound: mockedSetting,
  TWITTER_notiFilter: mockedSetting,
  TWITTER_notiSound: mockedSetting,
  TWITTER_notiSoundVol: 0,
  TWITTER_notifyNewFeedTweet: false,
  MARKETPLACE_notifyNewListing: false,
};

const Root = () => (
  <HashRouter>
    <NuiProvider>
      <Container>
        <Background src={image} />
        <React.Suspense fallback="Loading phone">
          <AppContainer>
            <MobileApp i18n={i18n} settings={mockedSettings} />
          </AppContainer>
        </React.Suspense>
      </Container>
    </NuiProvider>
  </HashRouter>
);

ReactDOM.render(<Root />, document.getElementById('mobile-app'));

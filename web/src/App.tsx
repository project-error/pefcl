import React, { useEffect, useState } from 'react';
import './App.css';
import { useNuiEvent } from './hooks/useNuiEvent';
import { debugData } from './utils/debugData';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useConfig } from './hooks/useConfig';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './views/dashboard/Dashboard';
import theme from './utils/theme';
import dayjs from 'dayjs';

const Container = styled.div`
  padding: 4rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 1400px;
  height: 800px;
  overflow: hidden;
  border-radius: 1rem;
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.default};
`;

debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

const App: React.FC = () => {
  const config = useConfig();
  const [isVisible, setIsVisible] = useState(true);
  const { i18n } = useTranslation();

  useNuiEvent<boolean>('setVisible', (data) => {
    setIsVisible(data);
  });

  useEffect(() => {
    i18n.changeLanguage(config.language).catch((e) => console.error(e));
  }, [i18n, config]);

  useEffect(() => {
    dayjs.locale(config.language);
  }, [i18n, config]);

  return (
    <>
      {isVisible && (
        <Container>
          <Content>
            <Routes>
              <Route path="/*" element={<Dashboard />} />
            </Routes>
          </Content>

          {/* <Content>
            <SidebarContainer>
              <React.Suspense fallback={<CircularProgress />}>
                <AccountsSidebar />
              </React.Suspense>
            </SidebarContainer>

            <BaseContainer>
              <React.Suspense fallback={<CircularProgress />}>
                <BankDetails />
              </React.Suspense>
            </BaseContainer>
          </Content> */}
        </Container>
      )}
    </>
  );
};

export default App;

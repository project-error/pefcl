import React, { useEffect } from 'react';
import './App.css';
import { debugData } from './utils/debugData';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useConfig } from './hooks/useConfig';
import { Route } from 'react-router-dom';
import Dashboard from './views/dashboard/Dashboard';
import theme from './utils/theme';
import dayjs from 'dayjs';
import Transactions from './views/transactions/Transactions';
import Accounts from './views/accounts/Accounts';
import { useNuiEvent } from 'react-fivem-hooks';
import { useExitListener } from '@hooks/useExitListener';

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
  const { data: isVisible } = useNuiEvent<boolean>({
    event: 'setVisible',
    defaultValue: process.env.NODE_ENV === 'development',
  });
  const { i18n } = useTranslation();
  useExitListener();

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
            <Route path="/" exact component={Dashboard} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/transactions" component={Transactions} />
          </Content>
        </Container>
      )}
    </>
  );
};

export default App;

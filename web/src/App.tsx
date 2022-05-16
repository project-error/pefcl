import styled from '@emotion/styled';
import { useExitListener } from '@hooks/useExitListener';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/sv';
import React, { useEffect, useState } from 'react';
import { useNuiEvent } from 'react-fivem-hooks';
import { useTranslation } from 'react-i18next';
import { Route } from 'react-router-dom';
import './App.css';
import { useConfig } from './hooks/useConfig';
import theme from './utils/theme';
import Accounts from './views/accounts/Accounts';
import Dashboard from './views/dashboard/Dashboard';
import Invoices from './views/Invoices/Invoices';
import ATM from './views/ATM/ATM';
import { UpdatesWrapper } from '@hooks/useUpdates';
import Transfer from './views/transfer/Transfer';
import Transactions from './views/transactions/Transactions';
import DebugBar from '@components/DebugBar';

dayjs.extend(updateLocale);

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

const App: React.FC = () => {
  const config = useConfig();
  const [hasLoaded, setHasLoaded] = useState(false);

  const { data: isVisible } = useNuiEvent<boolean>({
    event: 'setVisible',
    defaultValue: false,
  });

  const { data: isAtmVisible } = useNuiEvent<boolean>({
    event: 'setVisibleATM',
    defaultValue: false,
  });

  const { i18n } = useTranslation();
  useExitListener();

  useEffect(() => {
    i18n.changeLanguage(config?.general?.language).catch((e) => console.error(e));
  }, [i18n, config]);

  useEffect(() => {
    dayjs.locale(config?.general?.language ?? 'en');
  }, [i18n, config]);

  useEffect(() => {
    /* Create LOADED state for entire app. 
      The use of this is to only subscribe to updates from broadcasts once the app has been opened. */

    if (!hasLoaded && (isVisible || isAtmVisible)) {
      setHasLoaded(true);
    }
  }, [hasLoaded, isVisible, isAtmVisible]);

  return (
    <>
      {process.env.NODE_ENV === 'development' && <DebugBar />}

      {!isAtmVisible && isVisible && (
        <Container>
          <Content>
            <Route path="/" exact component={Dashboard} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/invoices" component={Invoices} />
            <Route path="/transfer" component={Transfer} />
          </Content>
        </Container>
      )}

      <ATM />

      {/* We don't need to show any fallback for the update component since it doesn't render anything anyway. */}
      <React.Suspense fallback={null}>{hasLoaded && <UpdatesWrapper />}</React.Suspense>
    </>
  );
};

export default App;

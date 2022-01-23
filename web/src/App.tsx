import React, { useEffect, useState } from 'react';
import './App.css';
import { useNuiEvent } from './hooks/useNuiEvent';
import { debugData } from './utils/debugData';
import { BankContainer, BankWrapper } from './components/BankContainer';
import { CircularProgress, Grid } from '@mui/material';
import AccountsSidebar from './features/accounts/AccountsSidebar';
import BankDetails from './features/details/BankDetails';
import { useTranslation } from 'react-i18next';
import { useConfigValue } from './states/bank';

debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();

  useNuiEvent<boolean>('setVisible', (data) => {
    setIsVisible(data);
  });

  const config = useConfigValue();

  useEffect(() => {
    i18n.changeLanguage(config.locale).catch((e) => console.error(e));
  }, [i18n, config]);

  return (
    <>
      {isVisible && (
        <BankWrapper>
          <BankContainer>
            <Grid container spacing={4} marginTop={0.1}>
              <Grid item xs={3}>
                <React.Suspense fallback={<CircularProgress />}>
                  <AccountsSidebar />
                </React.Suspense>
              </Grid>
              <Grid item xs={4}>
                <React.Suspense fallback={<CircularProgress />}>
                  <BankDetails />
                </React.Suspense>
              </Grid>
            </Grid>
          </BankContainer>
        </BankWrapper>
      )}
    </>
  );
};

export default App;

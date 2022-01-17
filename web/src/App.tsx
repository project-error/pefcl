import React, { useState } from 'react';
import './App.css';
import { useNuiEvent } from './hooks/useNuiEvent';
import { debugData } from './utils/debugData';
import { BankContainer, BankWrapper } from './components/BankContainer';
import { CircularProgress, Grid } from '@mui/material';
import AccountsSidebar from './features/accounts/AccountsSidebar';
import BankDetails from './features/details/BankDetails';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BankLayout from './components/BankLayout';

debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useNuiEvent<boolean>('setVisible', (data) => {
    console.log('actually getting someting', data);
    setIsVisible(data);
  });

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
                {/*
                  <Routes>
                    <Route path="/" element={<BankLayout />}>
                      <Route path=":id" element={<BankDetails />} />
                    </Route>
                  </Routes>
*/}
              </Grid>
            </Grid>
          </BankContainer>
        </BankWrapper>
      )}
    </>
  );
};

export default App;

import React, { useState } from 'react';
import './App.css';
import { useNuiEvent } from './hooks/useNuiEvent';
import { debugData } from './utils/debugData';
import { BankContainer, BankWrapper } from './components/BankContainer';
import { CircularProgress, Grid } from '@mui/material';
import AccountsSidebar from './features/accounts/AccountsSidebar';
import BankDetails from './features/details/BankDetails';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useNuiEvent<boolean>('setVisible', (data) => {
    setIsVisible(data);
  });

  return (
    <>
      {isVisible && (
        <BrowserRouter>
          <BankWrapper>
            <BankContainer>
              <Grid container spacing={2} marginTop={1}>
                <React.Suspense fallback={<CircularProgress />}>
                  <AccountsSidebar />
                  {/*
                  <Routes>
                    <Route path="account/:id" element={<BankDetails />} />
                  </Routes>
*/}
                </React.Suspense>
              </Grid>
            </BankContainer>
          </BankWrapper>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;

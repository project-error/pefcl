import React from 'react';
import styled from '@emotion/styled';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import TransferFundsModal from './Modals/TransferFunds';
import { useHistory } from 'react-router-dom';

const HeaderMenu = styled.div`
  top: 0;
  right: 0;
  padding: 2rem;
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 1.5rem;
`;

const LayoutHeader = () => {
  const { push } = useHistory();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div>
      <HeaderMenu>
        <Button onClick={() => push('/')}>{t('Home')}</Button>
        <Button onClick={() => push('/accounts')}>{t('Handle accounts')}</Button>
        <Button onClick={() => setIsTransferOpen(true)}>{t('Transfer funds')}</Button>
      </HeaderMenu>

      <Dialog
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        maxWidth={'sm'}
        fullWidth
        hideBackdrop
      >
        <React.Suspense fallback="Fetching stuff in header">
          <TransferFundsModal onClose={() => setIsTransferOpen(false)} />
        </React.Suspense>
      </Dialog>
    </div>
  );
};

export default LayoutHeader;

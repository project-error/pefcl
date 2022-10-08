import styled from '@emotion/styled';
import { Backdrop, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import { Heading1 } from '../../components/ui/Typography/Headings';
import { accountsAtom, totalBalanceAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import theme from '../../utils/theme';
import { AccountCard } from '@components/AccountCard';
import { AnimatePresence, motion } from 'framer-motion';
import AccountActions from './AccountActions';

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  margin-left: -0.5rem;

  & > div {
    width: calc(33% - 0.5rem);
    margin-left: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const Modal = styled(motion.div)`
  z-index: 2;
  padding: 2rem 3rem;
  position: absolute;
  width: calc(100% - 5rem);
  height: 100%;
  top: 0;
  left: 5rem;
  background-color: ${theme.palette.background.paper};
`;

const AccountsView = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);
  const [accounts] = useAtom(accountsAtom);
  const [selectedAccountId, setSelectedAccountId] = useState(-1);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  return (
    <Layout>
      <Stack>
        <PreHeading>{t('Total balance')}</PreHeading>
        <Heading1>{formatMoney(totalBalance, config.general)}</Heading1>
      </Stack>

      <CardContainer>
        {accounts.map((account) => (
          <div key={account.id} onClick={() => setSelectedAccountId(account.id)}>
            <AccountCard account={account} selected={account.id === selectedAccountId} />
          </div>
        ))}
      </CardContainer>

      <Backdrop
        open={Boolean(selectedAccount)}
        onClick={() => {
          setSelectedAccountId(0);
        }}
        sx={{ position: 'absolute' }}
      />

      <AnimatePresence>
        {selectedAccount && (
          <Modal animate={{ x: 0 }} initial={{ x: 100 }} exit={{ x: 200, opacity: 0 }}>
            <AccountActions account={selectedAccount} />
          </Modal>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default AccountsView;

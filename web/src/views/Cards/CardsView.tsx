import { AccountCard } from '@components/AccountCard';
import Layout from '@components/Layout';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading1 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { Backdrop, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import theme from '@utils/theme';
import BankCards from './components/BankCards';
import { selectedAccountIdAtom } from '@data/cards';
import { AccountType } from '@typings/Account';

const Container = styled.div`
  overflow: auto;
  height: 100%;
`;

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

const CardsView = () => {
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useAtom(selectedAccountIdAtom);
  const [accounts] = useAtom(accountsAtom);
  const { t } = useTranslation();

  return (
    <Layout>
      <Container>
        <Stack>
          <Heading1>{t('Accounts')}</Heading1>
          <PreHeading>{t('Handle cards for your accounts')}</PreHeading>
        </Stack>

        <CardContainer>
          {accounts.map((account) => (
            <div
              key={account.id}
              onClick={() =>
                account.type !== AccountType.Shared && setSelectedAccountId(account.id)
              }
            >
              <AccountCard
                account={account}
                selected={account.id === selectedAccountId}
                isDisabled={account.type === AccountType.Shared}
              />
            </div>
          ))}
        </CardContainer>

        <Backdrop
          open={Boolean(selectedAccountId)}
          onClick={() => {
            setSelectedAccountId(0);
            setSelectedCardId(0);
          }}
          sx={{ position: 'absolute' }}
        />

        <AnimatePresence>
          {Boolean(selectedAccountId) && (
            <Modal animate={{ x: 0 }} initial={{ x: 100 }} exit={{ x: 200, opacity: 0 }}>
              <BankCards
                selectedCardId={selectedCardId}
                onSelectCardId={setSelectedCardId}
                accountId={selectedAccountId}
              />
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    </Layout>
  );
};

export default CardsView;

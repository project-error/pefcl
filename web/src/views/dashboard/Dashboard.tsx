import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';
import { Dialog, Stack } from '@mui/material';
import { AnimatePresence, Reorder } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { totalNumberOfTransaction } from 'src/data/transactions';
import { Account } from '@typings/Account';
import Layout from '../../components/Layout';
import CreateAccountModal from '../../components/Modals/CreateAccount';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import { Heading1 } from '../../components/ui/Typography/Headings';
import { orderedAccountsAtom, totalBalanceAtom } from '../../data/accounts';
import { totalPendingInvoices } from '../../data/invoices';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import theme from '../../utils/theme';
import { AccountCard } from './../../components/Card';
import DashboardContainer, { DashboardContainerFallback } from './components/DashboardContainer';
import PendingInvoices from './components/PendingInvoices';
import Transactions from './components/Transactions';

const CardContainer = styled(Reorder.Item)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  button {
    margin-top: ${theme.spacing(1)};
  }
`;

const Cards = styled(Reorder.Group)`
  min-height: 7.5rem;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: ${theme.spacing(2.5)};
`;

const CreateCard = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.spacing(2)};
  border: 1px dashed ${theme.palette.grey[500]};
  font-size: 1.5rem;
  transition: 300ms;

  width: 5.5rem;
  height: 5.5rem;

  :hover {
    color: ${theme.palette.primary.main};
    border: 1px dashed ${theme.palette.primary.main};
  }

  svg {
    font-size: 2.5rem;
  }
`;

const Lists = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1.25fr;
  margin-top: ${theme.spacing(4)};
  grid-column-gap: ${theme.spacing(4)};
`;

const Dashboard = () => {
  const config = useConfig();
  const { t } = useTranslation();

  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [totalBalance] = useAtom(totalBalanceAtom);

  const [, setRefreshOrder] = useState({});
  const [orderedAccounts, setOrderedAccounts] = useAtom(orderedAccountsAtom);

  const handleReOrder = (accounts: Account[]) => {
    const order = accounts?.reduce((prev, curr, index) => ({ ...prev, [curr.id]: index }), {});
    setOrderedAccounts(order);
    setRefreshOrder(order); // TODO: This would not be needed if the 'orderedAccounts' was updated. Not sure why it doesn't.
  };

  return (
    <Layout>
      <Dialog
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        maxWidth="md"
        fullWidth
        hideBackdrop
      >
        <CreateAccountModal onClose={() => setIsCreateAccountOpen(false)} />
      </Dialog>

      <Stack spacing={4}>
        <Stack>
          <PreHeading>{t('Total balance')}</PreHeading>
          <Heading1>{formatMoney(totalBalance, config)}</Heading1>
        </Stack>

        <Cards values={orderedAccounts} onReorder={handleReOrder} axis="x">
          <AnimatePresence initial={false}>
            {orderedAccounts.map((account) => (
              <CardContainer key={account.id} value={account}>
                <AccountCard account={account} />
              </CardContainer>
            ))}
          </AnimatePresence>

          {orderedAccounts.length < 4 && (
            <CreateCard onClick={() => setIsCreateAccountOpen(true)}>
              <Add />
            </CreateCard>
          )}
        </Cards>
      </Stack>

      <Lists>
        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardContainer
            title={t('Transactions')}
            viewAllRoute="/transactions"
            totalAtom={totalNumberOfTransaction}
          >
            <Transactions />
          </DashboardContainer>
        </React.Suspense>

        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardContainer
            title={t('Transactions')}
            viewAllRoute="/transactions"
            totalAtom={totalNumberOfTransaction}
          >
            <Transactions />
          </DashboardContainer>
        </React.Suspense>

        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading invoices')} />}>
          <DashboardContainer
            title={t('Unpaid invoices')}
            viewAllRoute="/invoices"
            totalAtom={totalPendingInvoices}
          >
            <PendingInvoices />
          </DashboardContainer>
        </React.Suspense>

        {/* <DashboardContainer title={t('Fines')} total={2} viewAllRoute="/transactions">
          <PendingInvoices />
        </DashboardContainer> */}
      </Lists>
    </Layout>
  );
};

export default Dashboard;

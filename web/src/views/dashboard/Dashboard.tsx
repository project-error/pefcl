import React from 'react';
import { Card } from './../../components/Card';
import Layout from '../../components/Layout';
import { Heading1 } from '../../components/ui/Typography/Headings';
import { Stack } from '@mui/material';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import styled from '@emotion/styled';
import theme from '../../utils/theme';
import { useAtom } from 'jotai';
import { formatMoney } from '../../utils/currency';
import { useConfig } from '../../hooks/useConfig';
import { useTranslation } from 'react-i18next';
import DashboardContainer from './components/DashboardContainer';
import Transactions from './components/Transactions';
import { totalNumberOfTransaction } from '../../data/transactions';
import { accountsAtom, activeAccountAtom, totalBalanceAtom } from '../../data/accounts';
import { totalPendingInvoices } from '../../data/invoices';
import PendingInvoices from './components/PendingInvoices';
import { fetchNui } from '../../utils/fetchNui';
import { AccountEvents } from '../../../../typings/accounts';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  button {
    margin-top: ${theme.spacing(1)};
  }
`;

const Cards = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: ${theme.spacing(4)};
`;

const Lists = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: ${theme.spacing(4)};
  grid-column-gap: ${theme.spacing(4)};
`;

const Dashboard = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [accounts] = useAtom(accountsAtom);
  const [totalBalance] = useAtom(totalBalanceAtom);
  const [totalTransactions] = useAtom(totalNumberOfTransaction);
  const [totalInvoices] = useAtom(totalPendingInvoices);

  console.log({ accounts });

  const handleSetDefault = (id: number) => {
    console.log('setting default to:', id);
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: id });
  };

  return (
    <Layout>
      <Stack spacing={4}>
        <Stack>
          <PreHeading>Total balance</PreHeading>
          <Heading1>{formatMoney(totalBalance, config)}</Heading1>
        </Stack>

        <Cards>
          {accounts.map((account) => (
            <CardContainer key={account.id}>
              <Card
                {...account}
                // isDefault={activeAccount?.id === account.id}
                onClick={() => handleSetDefault(account.id)}
              />
            </CardContainer>
          ))}
        </Cards>
      </Stack>

      <Lists>
        <DashboardContainer title={t('Transactions')} total={totalTransactions}>
          <Transactions />
        </DashboardContainer>
        <DashboardContainer title={t('Invoices')} total={totalInvoices}>
          <PendingInvoices />
        </DashboardContainer>
        <DashboardContainer title={t('Fines')} total={2}>
          <PendingInvoices />
        </DashboardContainer>
      </Lists>
    </Layout>
  );
};

export default Dashboard;

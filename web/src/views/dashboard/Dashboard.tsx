import styled from '@emotion/styled';
import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { transactionsTotalAtom } from 'src/data/transactions';
import Layout from '../../components/Layout';
import theme from '../../utils/theme';
import DashboardContainer, { DashboardContainerFallback } from './components/DashboardContainer';
import PendingInvoices from './components/PendingInvoices';
import Transactions from './components/Transactions';
import DashboardSummary from './components/Summary';
import AccountCards, { LoadingCards } from './components/AccountCards';
import TotalBalance from '@components/TotalBalance';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading1 } from '@components/ui/Typography/Headings';
import { totalUnpaidInvoicesAtom } from '@data/invoices';

const Lists = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1.25fr;
  margin-top: ${theme.spacing(4)};
  grid-column-gap: ${theme.spacing(4)};
`;

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Stack spacing={4}>
        <React.Suspense
          fallback={
            <Stack>
              <PreHeading>
                <Skeleton variant="text" width={80} height={20} />
              </PreHeading>
              <Heading1>
                <Skeleton variant="text" width={200} height={55} />
              </Heading1>
            </Stack>
          }
        >
          <TotalBalance />
        </React.Suspense>

        <React.Suspense fallback={<LoadingCards />}>
          <AccountCards />
        </React.Suspense>
      </Stack>

      <Lists>
        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardSummary />
        </React.Suspense>

        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardContainer
            title={t('Latest transactions')}
            viewAllRoute="/transactions"
            totalAtom={transactionsTotalAtom}
          >
            <Transactions />
          </DashboardContainer>
        </React.Suspense>

        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading invoices')} />}>
          <DashboardContainer
            title={t('Unpaid invoices')}
            viewAllRoute="/invoices"
            totalAtom={totalUnpaidInvoicesAtom}
          >
            <PendingInvoices />
          </DashboardContainer>
        </React.Suspense>
      </Lists>
    </Layout>
  );
};

export default Dashboard;

import Layout from '@components/Layout';
import Pagination from '@components/Pagination';
import TransactionItem from '@components/TransactionItem';
import Count from '@components/ui/Count';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  transactionBaseAtom,
  transactionsLimitAtom,
  transactionsOffsetAtom,
  transactionsAtom,
  transactionsTotalAtom,
} from '@data/transactions';
import { Heading2, Heading5, Heading6 } from '../../components/ui/Typography/Headings';
import TransactionFilters, { TransactionFilter } from './Filters';

const Container = styled(Stack)`
  height: calc(100% - 5rem);
  display: flex;
  flex-direction: row;
`;

const TransactionsContainer = styled(Stack)`
  overflow: auto;
  padding-right: 0.5rem;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    background-color: ${theme.palette.background.dark4};
    border-radius: 2rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2rem;
    background-color: #80cae24a;
  }
`;

const Transactions = () => {
  const { t } = useTranslation();
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [transactions] = useAtom(transactionsAtom);
  const [total] = useAtom(transactionsTotalAtom);
  const [limit] = useAtom(transactionsLimitAtom);
  const [offset] = useAtom(transactionsOffsetAtom);
  const [activeFilters, setActiveFilters] = useState<TransactionFilter[]>([]);

  const chipFilteredTransactions =
    activeFilters.length === 0
      ? transactions
      : transactions.filter((transaction) => {
          const anyPassed: boolean[] = activeFilters.map((filterFunc) =>
            filterFunc.sort(transaction),
          );
          return anyPassed.some(Boolean);
        });

  const handlePagination = (offset: number) => {
    updateTransactions({ offset });
  };

  return (
    <Layout>
      <Heading2>{t('Transactions')}</Heading2>

      <Container spacing={4} direction="row" marginTop={4}>
        <Stack spacing={2} flex="4">
          <Stack direction="row" justifyContent="space-between">
            <Heading5>{t('Filters')}</Heading5>
            <Stack direction="row" spacing={2} alignItems="center">
              <Heading6>{t('Total')}</Heading6>
              <Count amount={total} />
            </Stack>
          </Stack>

          <TransactionFilters updateActiveFilters={setActiveFilters} />

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Heading5>{t('Transactions')}</Heading5>
          </Stack>
          <TransactionsContainer spacing={2}>
            {chipFilteredTransactions.map((transaction) => (
              <TransactionItem transaction={transaction} key={transaction.id} />
            ))}
          </TransactionsContainer>

          <Pagination limit={limit} offset={offset} total={total} onChange={handlePagination} />
        </Stack>
      </Container>
    </Layout>
  );
};

export default Transactions;

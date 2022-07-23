import Layout from '@components/Layout';
import TransactionItem from '@components/TransactionItem';
import Count from '@components/ui/Count';
import styled from '@emotion/styled';
import { Pagination, Stack } from '@mui/material';
import theme from '@utils/theme';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading2, Heading5, Heading6 } from '../../components/ui/Typography/Headings';
import TransactionFilters, { TransactionFilter } from './Filters';
import { fetchNui } from '@utils/fetchNui';
import { GetTransactionsResponse, Transaction } from '@typings/Transaction';
import { TransactionEvents } from '@typings/Events';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [activeFilters, setActiveFilters] = useState<TransactionFilter[]>([]);
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    fetchNui<GetTransactionsResponse>(TransactionEvents.Get, {
      limit,
      offset: limit * (page - 1),
    }).then((res) => {
      if (!res) {
        return;
      }

      setLimit(res.limit);
      setTotal(res.total);
      setTransactions(res.transactions);
    });
  }, [page, limit]);

  const chipFilteredTransactions =
    activeFilters.length === 0
      ? transactions
      : transactions.filter((transaction) => {
          const anyPassed: boolean[] = activeFilters.map((filterFunc) =>
            filterFunc.sort(transaction),
          );
          return anyPassed.some(Boolean);
        });

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

          <Stack sx={{ marginTop: 'auto', alignSelf: 'flex-end' }}>
            <Pagination
              count={pages}
              shape="rounded"
              onChange={handleChange}
              page={page}
              color="primary"
            />
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Transactions;

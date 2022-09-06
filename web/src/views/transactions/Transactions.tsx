import Layout from '@components/Layout';
import TransactionItem from '@components/TransactionItem';
import Count from '@components/ui/Count';
import styled from '@emotion/styled';
import { Pagination, Stack, Typography } from '@mui/material';
import theme from '@utils/theme';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading2, Heading5, Heading6 } from '../../components/ui/Typography/Headings';
import { fetchNui } from '@utils/fetchNui';
import { GetTransactionsResponse, Transaction } from '@typings/Transaction';
import { TransactionEvents } from '@typings/Events';
import { DEFAULT_PAGINATION_LIMIT } from '@utils/constants';

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
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT);
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);

  const offset = limit * (page - 1);
  const to = offset + limit > total ? total : offset + limit;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    fetchNui<GetTransactionsResponse>(TransactionEvents.Get, {
      limit,
      offset,
    }).then((res) => {
      if (!res) {
        return;
      }

      setLimit(res.limit);
      setTotal(res.total);
      setTransactions(res.transactions);
    });
  }, [offset, limit]);

  return (
    <Layout>
      <Heading2>{t('Transactions')}</Heading2>

      <Container spacing={4} direction="row" marginTop={4}>
        <Stack spacing={2} flex="4">
          <Stack direction="row" justifyContent="space-between">
            <Heading5>{t('Transactions')}</Heading5>
            <Stack direction="row" spacing={2} alignItems="center">
              <Heading6>{t('Total')}</Heading6>
              <Count amount={total} />
            </Stack>
          </Stack>

          <TransactionsContainer spacing={2}>
            {transactions.map((transaction) => (
              <TransactionItem transaction={transaction} key={transaction.id} />
            ))}
          </TransactionsContainer>

          <Stack
            pt={2}
            sx={{ marginTop: 'auto !important', alignSelf: 'flex-end' }}
            direction="row"
            alignItems="center"
          >
            <Typography variant="caption">
              {t('{{from}}-{{to}} of {{total}}', { from: offset, to, total })}
            </Typography>
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

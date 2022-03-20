import { AccountCard } from '@components/Card';
import Layout from '@components/Layout';
import TransactionItem from '@components/TransactionItem';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountsAtom } from 'src/data/accounts';
import { transactionsAtom } from 'src/data/transactions';
import { Heading2, Heading6 } from '../../components/ui/Typography/Headings';
import TransactionFilters, { TransactionFilter } from './Filters';

const Container = styled(Stack)`
  height: calc(100% - 5rem);
  display: flex;
  flex-direction: row;
`;

const SelectedContainer = styled.div<{ isSelected: boolean }>`
  overflow: hidden;
  border-radius: ${theme.spacing(2)};
  ${({ isSelected }) => isSelected && `outline: 1px solid ${theme.palette.primary.main};`}
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
  const [selectedAccountId, setSelectedAccountId] = useState(0);
  const [accounts] = useAtom(accountsAtom);
  const [transactions] = useAtom(transactionsAtom);
  const [activeFilters, setActiveFilters] = useState<TransactionFilter[]>([]);

  const filteredTransactions = transactions.filter(
    ({ toAccount, fromAccount }) =>
      toAccount?.id === selectedAccountId ||
      fromAccount?.id === selectedAccountId ||
      !selectedAccountId,
  );

  const chipFilteredTransactions =
    activeFilters.length === 0
      ? filteredTransactions
      : filteredTransactions.filter((transaction) => {
          const anyPassed: boolean[] = activeFilters.map((filterFunc) =>
            filterFunc.sort(transaction),
          );
          return anyPassed.some(Boolean);
        });

  return (
    <Layout>
      <Heading2>{t('Transactions')}</Heading2>

      <Container spacing={4} direction="row" marginTop={4}>
        <Stack spacing={2} flex="1.5">
          {accounts.map((account) => (
            <SelectedContainer
              key={account.id}
              isSelected={account.id === selectedAccountId}
              onClick={() => setSelectedAccountId(account.id ?? 0)}
            >
              <AccountCard account={account} />
            </SelectedContainer>
          ))}
        </Stack>

        <Stack spacing={2} flex="4">
          <Heading6>{t('Filters')}</Heading6>

          <TransactionFilters updateActiveFilters={setActiveFilters} />

          <Heading6>{t('Transactions')}</Heading6>
          <TransactionsContainer spacing={2}>
            {chipFilteredTransactions.map((transaction) => (
              <TransactionItem transaction={transaction} key={transaction.id} />
            ))}
          </TransactionsContainer>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Transactions;

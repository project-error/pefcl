import TransactionItem from '@components/TransactionItem';
import { Stack } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';
import { transactionsAtom } from '../../../data/transactions';

const Transactions = () => {
  const [transactions] = useAtom(transactionsAtom);

  return (
    <Stack spacing={2}>
      {transactions.slice(0, 3).map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} isLimitedSpace />
      ))}
    </Stack>
  );
};

export default Transactions;

import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import React from 'react';
import { Transaction } from '../../../../../typings/transactions';
import { BodyText } from '../../../components/ui/Typography/BodyText';
import { Heading6 } from '../../../components/ui/Typography/Headings';
import { transactionsAtom } from '../../../data/transactions';
import { useConfig } from '../../../hooks/useConfig';
import { formatMoney } from '../../../utils/currency';
import theme from '../../../utils/theme';

dayjs.extend(calendar);

const TransactionDate = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const TransactionMessage = styled(BodyText)`
  font-weight: ${theme.typography.fontWeightBold};
  white-space: pre;
  text-overflow: ellipsis;
  max-width: 14rem;
  overflow: hidden;
`;

const TransactionItem: React.FC<Transaction> = ({ message, amount, id, createdAt, ...props }) => {
  const config = useConfig();
  const date = dayjs.unix(parseInt(createdAt, 10));

  return (
    <div {...props} key={id}>
      <Stack flexDirection="row" justifyContent="space-between">
        <Stack spacing={1}>
          <TransactionMessage>{message}</TransactionMessage>
          <TransactionDate>{date.calendar()}</TransactionDate>
        </Stack>

        <BodyText>{formatMoney(amount, config)}</BodyText>
      </Stack>
    </div>
  );
};

const Transactions: React.FC = () => {
  const [transactions] = useAtom(transactionsAtom);

  return (
    <Stack spacing={2}>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} {...transaction} />
      ))}
    </Stack>
  );
};

export default Transactions;

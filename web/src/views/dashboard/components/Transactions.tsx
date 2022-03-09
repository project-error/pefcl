import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import React from 'react';
import { Transaction } from '../../../../../typings/transactions';
import { BodyText } from '../../../components/ui/Typography/BodyText';
import { Heading5, Heading6 } from '../../../components/ui/Typography/Headings';
import { transactionsAtom } from '../../../data/transactions';
import { useConfig } from '../../../hooks/useConfig';
import { formatMoney } from '../../../utils/currency';
import theme from '../../../utils/theme';
import {
  ArrowRight,
  ArrowRightAltOutlined,
  ArrowRightOutlined,
  ArrowRightRounded,
} from '@mui/icons-material';

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

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction, ...rest }) => {
  const { message, amount, id, createdAt, toAccount, fromAccount } = transaction;
  const config = useConfig();
  const date = dayjs(createdAt);

  return (
    <div key={id} {...rest}>
      <Stack flexDirection="row" justifyContent="space-between">
        <Stack spacing={1}>
          <TransactionMessage>{message}</TransactionMessage>
          <Stack direction="row" alignItems="center">
            {fromAccount && (
              <>
                <Heading6>{fromAccount?.accountName}</Heading6>
                <ArrowRightRounded color="primary" />
              </>
            )}

            <Heading6>{toAccount?.accountName}</Heading6>
          </Stack>
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
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </Stack>
  );
};

export default Transactions;

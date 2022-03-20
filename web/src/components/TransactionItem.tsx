import React from 'react';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import { ArrowDropDownRounded, ArrowDropUpRounded, ArrowRightRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { BodyText } from '@ui/Typography/BodyText';
import theme from '@utils/theme';
import { useConfig } from '@hooks/useConfig';
import { Transaction, TransactionType } from '@typings/transactions';
import { Stack } from '@mui/material';
import { Heading6 } from '@ui/Typography/Headings';
import { formatMoney } from '@utils/currency';

dayjs.extend(calendar);

const TransactionDate = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const TransactionMessage = styled(BodyText)`
  font-weight: ${theme.typography.fontWeightBold};
  white-space: pre;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 1rem;
  max-width: 12rem;
`;

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction, ...rest }) => {
  const { message, amount, id, createdAt, toAccount, fromAccount, type } = transaction;
  const config = useConfig();
  const date = dayjs(createdAt);
  const isOutgoing = type === TransactionType.Outgoing;
  const isIncoming = type === TransactionType.Incoming;
  const isTransfer = type === TransactionType.Transfer;

  return (
    <div key={id} {...rest}>
      <Stack flexDirection="row" justifyContent="space-between">
        <Stack spacing={1}>
          <TransactionMessage>{message}</TransactionMessage>
          <Stack direction="row" alignItems="center">
            {fromAccount && (
              <>
                <Heading6>{fromAccount?.accountName}</Heading6>
              </>
            )}
            {fromAccount && toAccount && <ArrowRightRounded color="primary" />}

            <Heading6>{toAccount?.accountName}</Heading6>
          </Stack>
          <TransactionDate>{date.calendar()}</TransactionDate>
        </Stack>

        <Stack direction="row" alignItems="flex-start" spacing={0.5}>
          {isOutgoing && <ArrowDropDownRounded color="error" />}
          {isIncoming && <ArrowDropUpRounded color="success" />}
          {isTransfer && <ArrowRightRounded color="primary" />}

          <BodyText>{formatMoney(amount, config)}</BodyText>
        </Stack>
      </Stack>
    </div>
  );
};

export default TransactionItem;

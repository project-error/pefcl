import React from 'react';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import { ArrowDropDownRounded, ArrowDropUpRounded, ArrowRightRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { BodyText } from '@ui/Typography/BodyText';
import theme from '@utils/theme';
import { useConfig } from '@hooks/useConfig';
import { Transaction, TransactionType } from '@typings/Transaction';
import { Stack } from '@mui/material';
import { Heading6 } from '@ui/Typography/Headings';
import { formatMoney } from '@utils/currency';
import { useTranslation } from 'react-i18next';

dayjs.extend(calendar);

const Container = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid ${theme.palette.background.light8};
`;

const TransactionDate = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const AccountName = styled(Heading6)`
  color: ${theme.palette.text.primary};
`;

const TransactionMessage = styled(BodyText)<{ isLimitedSpace?: boolean }>`
  font-weight: ${theme.typography.fontWeightBold};
  white-space: pre;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 1rem;
  ${({ isLimitedSpace }) => isLimitedSpace && `max-width: 12rem`};
`;

const TransactionItem: React.FC<{ transaction: Transaction; isLimitedSpace?: boolean }> = ({
  isLimitedSpace,
  transaction,
  ...rest
}) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, toAccount, fromAccount, type } = transaction;
  const config = useConfig();
  const createdAtDate = dayjs(createdAt);
  const isOutgoing = type === TransactionType.Outgoing;
  const isIncoming = type === TransactionType.Incoming;
  const isTransfer = type === TransactionType.Transfer;

  return (
    <Container key={id} {...rest}>
      <Stack flexDirection="row" justifyContent="space-between">
        <Stack spacing={1}>
          <TransactionMessage isLimitedSpace={isLimitedSpace}>{message}</TransactionMessage>

          {!isLimitedSpace && (
            <Stack direction="row" alignItems="center">
              {fromAccount && (
                <Stack>
                  <TransactionDate>{t('From account')}</TransactionDate>
                  <AccountName>{fromAccount?.accountName}</AccountName>
                </Stack>
              )}

              {fromAccount && toAccount && (
                <ArrowRightRounded sx={{ margin: '0 1rem' }} color="primary" />
              )}

              {toAccount && (
                <Stack>
                  <TransactionDate>{t('To account')}</TransactionDate>
                  <AccountName>{toAccount?.accountName}</AccountName>
                </Stack>
              )}
            </Stack>
          )}

          <TransactionDate>{createdAtDate.fromNow()}</TransactionDate>
        </Stack>

        <Stack alignItems="flex-end">
          <Stack direction="row" alignItems="flex-start" spacing={0.5}>
            {isOutgoing && <ArrowDropDownRounded color="error" />}
            {isIncoming && <ArrowDropUpRounded color="success" />}
            {isTransfer && <ArrowRightRounded color="primary" />}

            <BodyText>{formatMoney(amount, config.general)}</BodyText>
          </Stack>

          {!isLimitedSpace && (
            <TransactionDate>{createdAtDate.format(t('DATE_FORMAT'))}</TransactionDate>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default TransactionItem;

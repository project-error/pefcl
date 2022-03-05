import styled from '@emotion/styled';
import { Paper, Stack } from '@mui/material';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Invoice } from '../../../../../typings/Invoice';
import { useConfig } from '../../../hooks/useConfig';
import { formatMoney } from '../../../utils/currency';
import theme from '../../../utils/theme';
import Summary from '../../Summary';
import Button from '../../ui/Button';
import { BodyText } from '../../ui/Typography/BodyText';
import { Heading2, Heading5, Heading6 } from '../../ui/Typography/Headings';

dayjs.extend(calendar);

const Amount = styled(Heading2)`
  font-weight: ${theme.typography.fontWeightLight};
`;

interface PayInvoiceModalProps {
  invoice: Invoice;
  onCancel(): void;
}

const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({ onCancel, invoice }) => {
  const config = useConfig();
  const { t } = useTranslation();

  const date = dayjs(invoice.expiresAt);

  return (
    <Paper>
      <Stack p={8} direction="row" spacing={12} justifyContent="space-between">
        <Stack spacing={4} flex={1}>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Heading2>Invoice</Heading2>
              <Amount>{formatMoney(invoice.amount, config)}</Amount>
            </Stack>

            <Heading5>{invoice.from}</Heading5>
          </Stack>

          <Stack>
            <Heading6>{t('Message')}</Heading6>
            <BodyText>{invoice.message}</BodyText>
          </Stack>

          <Stack>
            <Heading6>{t('Expires')}</Heading6>
            <BodyText>{date.calendar()}</BodyText>
          </Stack>
        </Stack>

        <Stack spacing={4} flex={1}>
          <BodyText>Choose account here</BodyText>

          <Summary balance={40000} payment={invoice.amount} />

          <Stack direction="row" justifyContent="space-between">
            <Button color="error" onClick={onCancel}>
              {t('Cancel')}
            </Button>
            <Button>{t('Pay invoice')}</Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PayInvoiceModal;

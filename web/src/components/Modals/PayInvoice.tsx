import styled from '@emotion/styled';
import { Paper, Stack } from '@mui/material';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceEvents } from '@typings/Events';
import { Invoice, PayInvoiceInput } from '@typings/Invoice';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { invoicesAtom } from '../../data/invoices';
import { transactionsAtom } from '../../data/transactions';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import theme from '../../utils/theme';
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { BodyText } from '../ui/Typography/BodyText';
import { Heading2, Heading3, Heading5, Heading6 } from '../ui/Typography/Headings';

dayjs.extend(calendar);

const Amount = styled(Heading3)`
  font-weight: ${theme.typography.fontWeightLight};
`;

interface PayInvoiceModalProps {
  invoice: Invoice;
  onClose(): void;
}

const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({ onClose, invoice }) => {
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [, updateInvoices] = useAtom(invoicesAtom);
  const [, updateTransactions] = useAtom(transactionsAtom);
  const [selectedAccountId, setSelectedAccountId] = useState(defaultAccount?.id ?? 0);
  const config = useConfig();
  const { t } = useTranslation();

  const date = dayjs(invoice.expiresAt);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  const handlePayInvoice = () => {
    const payload: PayInvoiceInput = {
      fromAccountId: selectedAccountId,
      invoiceId: invoice.id,
    };

    fetchNui(InvoiceEvents.PayInvoice, payload)
      .then(() => {
        updateInvoices();
        updateAccounts();
        updateTransactions();
      })
      .finally(onClose);
  };

  console.log({ selectedAccountId });

  return (
    <Paper>
      <Stack p={8} direction="row" spacing={12} justifyContent="space-between">
        <Stack spacing={4} flex={1}>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Heading2>{t('Invoice')}</Heading2>
              <Amount>{formatMoney(invoice.amount, config)}</Amount>
            </Stack>

            <Heading5>{invoice.from}</Heading5>
          </Stack>

          <Stack>
            <Heading6>{t('Message')}</Heading6>
            <BodyText>{invoice.message}</BodyText>
          </Stack>

          <Stack spacing={0.25}>
            <Heading6>{t('Expires')}</Heading6>
            <BodyText>
              {date.calendar()} ({date.fromNow()})
            </BodyText>
          </Stack>
        </Stack>

        <Stack spacing={4} flex={1}>
          <AccountSelect
            accounts={accounts}
            onSelect={setSelectedAccountId}
            selectedId={selectedAccountId}
          />

          <Summary balance={selectedAccount?.balance ?? 0} payment={invoice.amount} />

          <Stack direction="row" justifyContent="space-between">
            <Button color="error" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button onClick={handlePayInvoice} disabled={!selectedAccountId}>
              {t('Pay invoice')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PayInvoiceModal;

import i18n from '@utils/i18n';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import './mobile.module.css';
import { AccountCard } from '@components/Card';
import { Account } from '@typings/Account';
import { fetchNui } from '@utils/fetchNui';
import { AccountEvents, InvoiceEvents } from '@typings/Events';
import styled from 'styled-components';
import { GetInvoicesResponse, Invoice } from '@typings/Invoice';
import InvoiceItem from '@components/InvoiceItem';
import theme from '@utils/theme';
import { Stack } from '@mui/material';

const Container = styled.div`
  color: white;
  background: ${theme.palette.background.default};
  overflow: auto;
  height: 100%;
`;

const Mobile = () => {
  const [defaultAccount, setDefaultAccount] = React.useState<Account>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, {
      limit: 5,
      offset: 0,
    }).then((res) => {
      setInvoices(res?.invoices ?? []);
    });
  }, []);

  useEffect(() => {
    fetchNui<Account[]>(AccountEvents.GetAccounts).then((accounts) => {
      const defaultAccount = accounts?.find((account) => account.isDefault);
      setDefaultAccount(defaultAccount);
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Container>
        <div style={{ padding: '2rem' }}>
          <Stack spacing={2}>
            {defaultAccount && <AccountCard account={defaultAccount} />}

            <Stack spacing={2.5}>
              {invoices.map((invoice) => (
                <InvoiceItem key={invoice.id} invoice={invoice} />
              ))}
            </Stack>
          </Stack>
        </div>
      </Container>
    </I18nextProvider>
  );
};

export default Mobile;

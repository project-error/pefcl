import { AccountCard } from '@components/Card';
import InvoiceItem from '@components/InvoiceItem';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { Account } from '@typings/Account';
import { AccountEvents, InvoiceEvents } from '@typings/Events';
import { GetInvoicesResponse, Invoice } from '@typings/Invoice';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';

const Component = () => {
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
    <Box p={4}>
      <Stack spacing={2}>
        {defaultAccount && <AccountCard account={defaultAccount} />}

        <Stack spacing={2.5}>
          {invoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Component;

import InvoiceItem from '@components/InvoiceItem';
import Layout from '@components/Layout';
import React, { useEffect, useState } from 'react';
import { Heading3, Heading6 } from '@components/ui/Typography/Headings';
import { Pagination, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import theme from '@utils/theme';
import styled from '@emotion/styled';
import { GetInvoicesResponse, Invoice } from '@typings/Invoice';
import { InvoiceEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';

const NoInvoicesText = styled(Heading3)`
  padding-top: 4rem;
  text-align: center;
  color: ${theme.palette.text.secondary};
`;

const InvoicesContainer = styled(Stack)`
  overflow: auto;
  max-height: calc(100% - 4.5rem);
  padding-right: 1rem;
`;

const Invoices = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, {
      limit,
      offset: limit * (page - 1),
    }).then((res) => {
      if (!res) {
        return;
      }

      setLimit(res.limit);
      setTotal(res.total);
      setInvoices(res.invoices);
    });
  }, [page, limit]);

  return (
    <Layout title={t('Invoices')}>
      <Stack paddingBottom="1rem">
        <Heading6>{t('Pay your bills')}</Heading6>
      </Stack>

      <InvoicesContainer spacing={2.5}>
        {invoices.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        ))}
        <Stack sx={{ marginTop: 'auto', alignSelf: 'flex-end' }}>
          <Pagination
            count={pages}
            shape="rounded"
            onChange={handleChange}
            page={page}
            color="primary"
          />
        </Stack>
      </InvoicesContainer>

      {invoices.length === 0 && <NoInvoicesText>{t('No invoices, yet.')}</NoInvoicesText>}
    </Layout>
  );
};

export default Invoices;

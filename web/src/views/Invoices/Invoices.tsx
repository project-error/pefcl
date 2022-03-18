import InvoiceItem from '@components/InvoiceItem';
import Layout from '@components/Layout';
import React from 'react';
import { Heading3, Heading6 } from '@components/ui/Typography/Headings';
import { Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { invoicesAtom } from 'src/data/invoices';
import theme from '@utils/theme';
import styled from '@emotion/styled';

const NoInvoicesText = styled(Heading3)`
  padding-top: 4rem;
  text-align: center;
  color: ${theme.palette.text.secondary};
`;

const Invoices = () => {
  const { t } = useTranslation();
  const [invoices] = useAtom(invoicesAtom);

  return (
    <Layout title={t('Invoices')}>
      <Stack spacing={2}>
        <Heading6>{t('Pay your bills')}</Heading6>
        {invoices.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        ))}

        {invoices.length === 0 && <NoInvoicesText>{t('No invoices, yet.')}</NoInvoicesText>}
      </Stack>
    </Layout>
  );
};

export default Invoices;

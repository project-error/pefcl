import { t } from 'i18next';
import React from 'react';
import Layout from '../../components/Layout';
import { Heading2 } from '../../components/ui/Typography/Headings';

const Transactions = () => {
  return (
    <Layout>
      <Heading2>{t('Transactions')}</Heading2>
    </Layout>
  );
};

export default Transactions;

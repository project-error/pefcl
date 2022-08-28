import Layout from '@components/Layout';
import TransferFunds from '@components/TransferFunds';
import { t } from 'i18next';
import React from 'react';

const Transfer = () => {
  return (
    <Layout title={t('Transfer')}>
      <TransferFunds />
    </Layout>
  );
};

export default Transfer;

import React from 'react';
import { Route } from 'react-router-dom';
import MobileAccountsView from './views/Accounts/MobileAccountsView';
import MobileDashboardView from './views/Dashboard/MobileDashboardView';
import MobileInvoicesView from './views/Invoices/MobileInvoicesView';
import MobileTransferView from './views/Transfer/MobileTransferView';

const MobileRoutes = () => {
  return (
    <>
      <Route path="/" exact component={MobileDashboardView} />
      <Route path="/accounts" component={MobileAccountsView} />
      <Route path="/dashboard" component={MobileDashboardView} />
      <Route path="/transfer" component={MobileTransferView} />
      <Route path="/invoices" component={MobileInvoicesView} />
    </>
  );
};

export default MobileRoutes;

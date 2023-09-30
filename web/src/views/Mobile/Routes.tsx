import { useGlobalSettings } from '@hooks/useGlobalSettings';
import React from 'react';
import { Route } from 'react-router-dom';
import MobileAccountsView from './views/Accounts/MobileAccountsView';
import MobileDashboardView from './views/Dashboard/MobileDashboardView';
import MobileInvoicesView from './views/Invoices/MobileInvoicesView';
import MobileTransferView from './views/Transfer/MobileTransferView';

const MobileRoutes = () => {
  const settings = useGlobalSettings();
  const prefix = settings.isMobile ? '/bank' : '';

  return (
    <>
      <Route path={`${prefix}/accounts`} component={MobileAccountsView} />
      <Route path={`${prefix}/dashboard`} component={MobileDashboardView} />
      <Route path={`${prefix}/transfer`} component={MobileTransferView} />
      <Route path={`${prefix}/invoices`} component={MobileInvoicesView} />
    </>
  );
};

export default MobileRoutes;

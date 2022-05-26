import i18n from '@utils/i18n';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import './mobile.module.css';
import { AccountCard } from '@components/Card';
import { Account } from '@typings/Account';
import { fetchNui } from '@utils/fetchNui';
import { AccountEvents } from '@typings/Events';

const Mobile = () => {
  const [defaultAccount, setDefaultAccount] = React.useState<Account>();

  useEffect(() => {
    fetchNui<Account[]>(AccountEvents.GetAccounts).then((accounts) => {
      const defaultAccount = accounts?.find((account) => account.isDefault);
      setDefaultAccount(defaultAccount);
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ color: 'black' }}>HELLO WORLD</h1>
        {defaultAccount && <AccountCard account={defaultAccount} />}
      </div>
    </I18nextProvider>
  );
};

export default Mobile;

import React, { memo } from 'react';
import { Account, AccountType } from '../../../../typings/accounts';
import AccountItem from './components/AccountItem';
import { useTranslation } from 'react-i18next';
import { AccountListHeader } from './AccountList.styles';

interface AccountListProps {
  accounts: Account[];
  handleChangeAccount: (account: Account) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, handleChangeAccount }) => {
  const [t] = useTranslation();

  const hasSharedAccounts = accounts.some((acc) => acc.type === AccountType.Shared);

  if (!accounts) return <h1>Loading...</h1>;

  return (
    <>
      <AccountListHeader>{t('accounts.list.personal')}</AccountListHeader>
      <div style={{ marginBottom: 30 }}>
        {accounts &&
          accounts
            .filter((acc) => acc.type === AccountType.Personal)
            .map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onClick={() => handleChangeAccount(account)}
              />
            ))}
      </div>
      <AccountListHeader>{t('accounts.list.shared')}</AccountListHeader>
      <div>
        {hasSharedAccounts &&
          accounts
            .filter((acc) => acc.type === AccountType.Shared)
            .map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onClick={() => handleChangeAccount(account)}
              />
            ))}
      </div>
    </>
  );
};

export default memo(AccountList);

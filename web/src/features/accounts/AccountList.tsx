import React, { memo } from 'react';
import { Account, AccountType } from '../../../../typings/accounts';
import AccountItem from './components/AccountItem';
import { useTranslation } from 'react-i18next';
import { AccountListHeader } from './AccountList.styles';
import styled from '@emotion/styled';

const NoAccountText = styled.p`
  color: #888;
  margin-top: 2rem;
  text-align: center;
`;

interface AccountListProps {
  accounts: Account[];
  onSelectAccount: (accountId: number) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, onSelectAccount }) => {
  const { t } = useTranslation();

  const hasSharedAccounts = accounts.some((acc) => acc.type === AccountType.Shared);
  const hasPersonalAccounts = accounts.some((acc) => acc.type === AccountType.Personal);

  if (!accounts) return <h1>Loading...</h1>;

  return (
    <>
      {hasPersonalAccounts && (
        <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
          <AccountListHeader>{t('Personal accounts')}</AccountListHeader>
          {accounts
            .filter((acc) => acc.type === AccountType.Personal)
            .map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onClick={() => onSelectAccount(account.id)}
              />
            ))}
        </div>
      )}

      {hasSharedAccounts && (
        <div>
          <AccountListHeader>{t('Shared accounts')}</AccountListHeader>
          {accounts
            .filter((acc) => acc.type === AccountType.Shared)
            .map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onClick={() => onSelectAccount(account.id)}
              />
            ))}
        </div>
      )}

      {!hasSharedAccounts && !hasPersonalAccounts && (
        <NoAccountText>No accounts found</NoAccountText>
      )}
    </>
  );
};

export default memo(AccountList);

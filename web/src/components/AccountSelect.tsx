import styled from '@emotion/styled';
import { InputBase, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountType } from '../../../typings/accounts';
import { ResourceConfig } from '../../../typings/config';
import { useConfig } from '../hooks/useConfig';
import CaretIcon from '../icons/CaretIcon';
import { formatMoney } from '../utils/currency';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading6 } from './ui/Typography/Headings';

const BalanceText = styled(Heading6)`
  color: ${theme.palette.primary.main};
`;

const StyledInput = styled(InputBase)`
  border-radius: ${theme.spacing(1)};
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.dark12};

  & > div {
    padding: 0.75rem 1rem;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &.Mui-selected {
    background: ${theme.palette.background.dark12};
  }

  &.Mui-selected:focus-visible,
  &.Mui-selected:focus,
  &.Mui-selected:hover {
    background: ${theme.palette.background.dark12};
  }

  &.Mui-focusVisible {
    background: ${theme.palette.background.dark4};
  }
`;

const SelectIcon = styled(CaretIcon)`
  color: ${theme.palette.text.primary};
  color: white !important;
  margin-right: 0.5rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 0.75rem;
`;

const Option: React.FC<{ account: Account; config: ResourceConfig }> = ({ account, config }) => {
  const { t } = useTranslation();
  return (
    <ListItem>
      <Stack p="0rem 0.5rem">
        <BodyText>{account.accountName}</BodyText>
        <BalanceText>{formatMoney(account.balance, config)}</BalanceText>
      </Stack>
      <Heading6>{account.type === AccountType.Personal ? t('Personal') : t('Shared')}</Heading6>
    </ListItem>
  );
};

interface AccountSelect {
  accounts: Account[];
  selectedId?: number;
  onSelect(accountId: number): void;
}

const AccountSelect: React.FC<AccountSelect> = ({ accounts: accounts, onSelect, selectedId }) => {
  const config = useConfig();
  const initialValue = accounts.find((account) => account.isDefault)?.id ?? 0;
  const [selected, setSelected] = useState<number>(initialValue);

  const sharedAccounts = accounts.filter((account) => account.type === AccountType.Shared);
  const personalAccounts = accounts.filter((account) => account.type === AccountType.Personal);

  useEffect(() => {
    if (selectedId) {
      setSelected(selectedId);
    }
  }, [selectedId]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    if (isNaN(value)) {
      return;
    }

    setSelected(value);
    onSelect(value);
  };

  return (
    <div>
      <Select
        id="account-select"
        value={selected}
        onChange={handleChange}
        variant="filled"
        input={<StyledInput sx={{ border: 'none', outline: 'none' }} />}
        sx={{ width: '100%' }}
        IconComponent={(props) => {
          return <SelectIcon {...props} />;
        }}
      >
        {personalAccounts.map((account) => (
          <StyledMenuItem key={account.id} value={account.id} disabled={selectedId === account.id}>
            <Option account={account} config={config} />
          </StyledMenuItem>
        ))}

        {sharedAccounts.map((account) => (
          <StyledMenuItem key={account.id} value={account.id} disabled={selectedId === account.id}>
            <Option account={account} config={config} />
          </StyledMenuItem>
        ))}
      </Select>
    </div>
  );
};

export default AccountSelect;

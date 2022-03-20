import styled from '@emotion/styled';
import { ListSubheader, MenuItem, SelectChangeEvent, Stack } from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountType, ExternalAccount } from '@typings/Account';
import { ResourceConfig } from '../../../typings/config';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading6 } from './ui/Typography/Headings';
import Select from './ui/Select';
import Button from './ui/Button';
import { Box } from '@mui/system';
import AddExternalAccountModal from './Modals/AddExternalAccount';

const BalanceText = styled(Heading6)`
  color: ${theme.palette.primary.main};
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

interface AccountSelectProps {
  accounts: Account[];
  selectedId?: number;
  isExternalAvailable?: boolean;
  externalAccounts?: ExternalAccount[];
  onSelect(accountId: number): void;
}

const AccountSelect = ({
  accounts,
  onSelect,
  selectedId,
  isExternalAvailable = false,
  externalAccounts = [],
}: AccountSelectProps) => {
  const config = useConfig();
  const [isExternalOpen, setIsExternalOpen] = useState(false);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    if (selectedId) {
      setSelected(selectedId);
    }
  }, [selectedId]);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    console.log('change to:', event.target.value);
    const value = Number(event.target.value);
    if (isNaN(value)) {
      return;
    }

    setSelected(value);
    onSelect(value);
  };

  return (
    <div>
      <AddExternalAccountModal isOpen={isExternalOpen} onClose={() => setIsExternalOpen(false)} />
      <Select
        value={selected.toString()}
        onChange={handleChange}
        variant="filled"
        sx={{ width: '100%' }}
        MenuProps={{ sx: { maxHeight: '25rem', scrollbarColor: '#222', scrollbarWidth: '2px' } }}
      >
        {isExternalAvailable && (
          <Box p={2} display="flex">
            <Button fullWidth onClick={() => setIsExternalOpen(true)}>
              {t('Add external account')}
            </Button>
          </Box>
        )}

        {selected === 0 && (
          <StyledMenuItem value={0} disabled>
            <ListItem>
              <Stack p="0rem 0.5rem">
                <Heading6>{t('Select account')}</Heading6>
              </Stack>
            </ListItem>
          </StyledMenuItem>
        )}

        {externalAccounts.length > 0 && <ListSubheader>{t('Your accounts')}</ListSubheader>}
        {accounts.map((account) => (
          <StyledMenuItem
            key={account.id}
            value={account.id.toString()}
            disabled={selectedId === account.id}
          >
            <Option account={account} config={config} />
          </StyledMenuItem>
        ))}

        {externalAccounts.length > 0 && <ListSubheader>{t('External accounts')}</ListSubheader>}
        {externalAccounts.map((account) => (
          <StyledMenuItem key={account.id} value={`0.${account.id}`}>
            <ListItem>
              <Stack p="0rem 0.5rem">
                <BodyText>{account.name}</BodyText>
                <Heading6>{account.number}</Heading6>
              </Stack>
            </ListItem>
          </StyledMenuItem>
        ))}
      </Select>
    </div>
  );
};

export default AccountSelect;

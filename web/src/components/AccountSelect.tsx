import styled from '@emotion/styled';
import { ListSubheader, MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountRole, AccountType, ExternalAccount } from '@typings/Account';
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

const Option: React.FC<{
  account: Account;
  config: ResourceConfig;
  isDisabledByContributor?: boolean;
}> = ({ account, config, isDisabledByContributor }) => {
  const { t } = useTranslation();
  return (
    <ListItem>
      <Stack p="0rem 0.5rem">
        <BodyText>{account.accountName}</BodyText>
        {isDisabledByContributor ? (
          <Typography variant="caption">
            {t('Contributors cannot use money in shared accounts.')}
          </Typography>
        ) : (
          <BalanceText>{formatMoney(account.balance, config.general)}</BalanceText>
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Heading6>{account.type === AccountType.Personal ? t('Personal') : t('Shared')}</Heading6>
      </Stack>
    </ListItem>
  );
};

interface AccountSelectProps {
  accounts: Account[];
  selectedId?: number;
  isFromAccount?: boolean;
  externalAccounts?: ExternalAccount[];
  onSelect(accountId: number): void;
}

const AccountSelect = ({
  accounts,
  onSelect,
  selectedId,
  isFromAccount = false,
  externalAccounts = [],
}: AccountSelectProps) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [isExternalOpen, setIsExternalOpen] = useState(false);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    if (selectedId) {
      setSelected(selectedId);
    }
  }, [selectedId]);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const value = Number(event.target.value);
    if (isNaN(value)) {
      return;
    }

    setSelected(value);
    onSelect(value);
  };

  const handleAddExternalAccount = () => {
    setIsOpen(false);
    setIsExternalOpen(true);
  };

  return (
    <div>
      <React.Suspense fallback={null}>
        <AddExternalAccountModal isOpen={isExternalOpen} onClose={() => setIsExternalOpen(false)} />
      </React.Suspense>
      <Select
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onClick={() => !isOpen && setIsOpen(true)}
        value={selected.toString()}
        onChange={handleChange}
        variant="filled"
        sx={{ width: '100%' }}
        MenuProps={{
          sx: {
            maxHeight: '25rem',
            scrollbarColor: '#222',
            scrollbarWidth: '2px',
          },
        }}
      >
        {!isFromAccount && (
          <Box p={2} display="flex">
            <Button fullWidth onClick={handleAddExternalAccount}>
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
        {accounts.map((account) => {
          const isDisabledByContributor = isFromAccount && account.role === AccountRole.Contributor;
          return (
            <StyledMenuItem
              key={account.id}
              value={account.id.toString()}
              disabled={selectedId === account.id || isDisabledByContributor}
            >
              <Option
                account={account}
                config={config}
                isDisabledByContributor={isDisabledByContributor}
              />
            </StyledMenuItem>
          );
        })}

        {externalAccounts.length > 0 && <ListSubheader>{t('External accounts')}</ListSubheader>}
        {externalAccounts.map((account) => (
          <StyledMenuItem key={account.id} value={account.id.toString()}>
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

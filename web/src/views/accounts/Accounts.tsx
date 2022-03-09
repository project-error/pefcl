import styled from '@emotion/styled';
import { Stack, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountEvents } from '../../../../typings/accounts';
import { Card } from '../../components/Card';
import Layout from '../../components/Layout';
import Button from '../../components/ui/Button';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import { Heading1, Heading5, Heading6 } from '../../components/ui/Typography/Headings';
import { accountsAtom, defaultAccountAtom, totalBalanceAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import theme from '../../utils/theme';

const Cards = styled.div`
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin-top: ${theme.spacing(4)};
  grid-column-gap: ${theme.spacing(2.5)};
`;

const SelectedContainer = styled.div<{ isSelected: boolean }>`
  overflow: hidden;
  border-radius: ${theme.spacing(2)};
  ${({ isSelected }) => isSelected && `outline: 1px solid ${theme.palette.primary.main};`}
`;

const Dangerzone = styled.div`
  border: 1px solid ${theme.palette.error.main};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.spacing(2)};
`;

const DeleteAccountExlaimer = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const Accounts = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(defaultAccount?.id ?? 0);

  const handleSetDefault = () => {
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: selectedAccountId })
      .then(updateAccounts)
      .catch((err) => {
        console.log({ err });
      });
  };

  const handleDeleteAccount = () => {
    fetchNui(AccountEvents.DeleteAccount, { accountId: selectedAccountId })
      .then(updateAccounts)
      .catch((err) => {
        console.log({ err });
      });
  };

  const isDefaultAccountSelected = defaultAccount?.id === selectedAccountId;

  return (
    <Layout>
      <Stack>
        <PreHeading>{t('Total balance')}</PreHeading>
        <Heading1>{formatMoney(totalBalance, config)}</Heading1>
      </Stack>

      <Cards>
        {accounts.map((account) => (
          <SelectedContainer
            key={account.id}
            isSelected={selectedAccountId === account.id}
            onClick={() => setSelectedAccountId(account.id)}
          >
            <Card account={account} />
          </SelectedContainer>
        ))}
      </Cards>

      <Stack spacing={5} marginTop={5}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Heading5>{t('General')}</Heading5>
          <Button onClick={handleSetDefault} disabled={isDefaultAccountSelected}>
            {t('Set account to default')}
          </Button>
        </Stack>

        <Stack spacing={1.5} alignItems="flex-start">
          <Heading5>{t('Danger zone')}</Heading5>
          <Dangerzone>
            <Stack spacing={2}>
              <span>
                <Button
                  color="error"
                  onClick={handleDeleteAccount}
                  disabled={isDefaultAccountSelected}
                >
                  {t('Delete account')}
                </Button>
              </span>

              <DeleteAccountExlaimer>
                {isDefaultAccountSelected
                  ? t('You cannot delete the default account')
                  : t('Funds will be transfered to default account.')}
              </DeleteAccountExlaimer>
            </Stack>
          </Dangerzone>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Accounts;

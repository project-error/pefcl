import TextField from '@components/ui/Fields/TextField';
import styled from '@emotion/styled';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Box } from '@mui/system';
import copy from 'copy-to-clipboard';
import { AccountType } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { getIsAdmin, getIsOwner } from '@utils/account';
import { useAtom } from 'jotai';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionBaseAtom } from 'src/data/transactions';
import Layout from '../../components/Layout';
import Button from '../../components/ui/Button';
import { PreHeading } from '../../components/ui/Typography/BodyText';
import { Heading1, Heading5, Heading6 } from '../../components/ui/Typography/Headings';
import { accountsAtom, defaultAccountAtom, totalBalanceAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import theme from '../../utils/theme';
import AccountCards from '../dashboard/components/AccountCards';
import SharedSettings from './SharedSettings';

const Dangerzone = styled.div`
  border: 1px solid ${theme.palette.error.main};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.spacing(2)};
`;

const HelperText = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const Accounts = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(defaultAccount?.id ?? 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const handleUpdateAccounts = () => {
    updateAccounts();
  };

  const handleSetDefault = () => {
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: selectedAccountId })
      .then(handleUpdateAccounts)
      .catch((err) => {
        console.log({ err });
      });
  };

  const handleDeleteAccount = async () => {
    await fetchNui(AccountEvents.DeleteAccount, { accountId: selectedAccountId });
    await updateAccounts();
    await updateTransactions();
  };

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchNui(AccountEvents.RenameAccount, { accountId: selectedAccountId, name: renameInput }).then(
      handleUpdateAccounts,
    );
    setIsRenameOpen(false);
  };

  useEffect(() => {
    if (selectedAccount?.accountName) {
      setRenameInput(selectedAccount.accountName);
    }
  }, [selectedAccount?.accountName]);

  const isAdmin = Boolean(selectedAccount && getIsAdmin(selectedAccount));
  const isOwner = Boolean(selectedAccount && getIsOwner(selectedAccount));
  const isShared = selectedAccount?.type === AccountType.Shared;
  const isDefaultAccountSelected = defaultAccount?.id === selectedAccountId;

  return (
    <Layout>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        hideBackdrop
      >
        <DialogTitle>{t('Rename account')}</DialogTitle>
        <form onSubmit={handleRename}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                autoFocus
                placeholder={t('New account name')}
                value={renameInput}
                onChange={(event) => setRenameInput(event.target.value)}
              />

              <DialogActions>
                <Button color="error" onClick={() => setIsRenameOpen(false)}>
                  {t('Cancel')}
                </Button>
                <Button type="submit">{t('Rename')}</Button>
              </DialogActions>
            </Stack>
          </DialogContent>
        </form>
      </Dialog>

      <Stack>
        <PreHeading>{t('Total balance')}</PreHeading>
        <Heading1>{formatMoney(totalBalance, config.general)}</Heading1>
      </Stack>

      <Box paddingTop={4}>
        <AccountCards
          onSelectAccount={setSelectedAccountId}
          selectedAccountId={selectedAccountId}
        />
      </Box>

      <Stack direction="row" spacing={5} marginTop={5}>
        <Stack spacing={5}>
          <Stack spacing={1.5} alignItems="flex-start">
            <Heading5>{t('General')}</Heading5>
            <Stack direction="row" spacing={4} alignItems="flex-start">
              <Stack spacing={0.75}>
                <Button
                  onClick={handleSetDefault}
                  disabled={isDefaultAccountSelected || !isAdmin || isShared}
                >
                  {t('Set account to default')}
                </Button>
                {!isAdmin && <HelperText>{t('Admin role required')}</HelperText>}
                {isAdmin && isShared && (
                  <HelperText>{t('Shared account cannot be default account')}</HelperText>
                )}
              </Stack>

              <Stack spacing={0.75}>
                <Button onClick={() => setIsRenameOpen(true)} disabled={!isAdmin}>
                  {t('Rename account')}
                </Button>
                {!isAdmin && <HelperText>{t('Admin role required')}</HelperText>}
              </Stack>

              <Stack spacing={0.75}>
                <Button onClick={() => copy(selectedAccount?.number ?? '')}>
                  {t('Copy account number')}
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {isOwner && (
            <Stack spacing={1.5} alignItems="flex-start">
              <Heading5>{t('Danger zone')}</Heading5>
              <Dangerzone>
                <Stack spacing={1.5}>
                  <span>
                    <Button
                      color="error"
                      onClick={handleDeleteAccount}
                      disabled={isDefaultAccountSelected}
                    >
                      {t('Delete account')}
                    </Button>
                  </span>

                  <HelperText>
                    {isDefaultAccountSelected
                      ? t('You cannot delete the default account')
                      : t('Funds will be transfered to default account.')}
                  </HelperText>
                </Stack>
              </Dangerzone>
            </Stack>
          )}
        </Stack>

        <Stack>
          {isShared && <SharedSettings accountId={selectedAccountId} isAdmin={isAdmin} />}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Accounts;

import React, { FormEvent, useState } from 'react';
import Button from '@components/ui/Button';
import { Heading5, Heading6 } from '@components/ui/Typography/Headings';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Account, AccountType } from '@typings/Account';
import { getIsAdmin, getIsOwner } from '@utils/account';
import styled from 'styled-components';
import theme from '@utils/theme';
import SharedSettings from './SharedSettings';
import { useTranslation } from 'react-i18next';
import { AccountEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import { useSetAtom } from 'jotai';
import { accountsAtom } from '@data/accounts';
import TextField from '@components/ui/Fields/TextField';
import { AccountCard } from '@components/AccountCard';
import { transactionBaseAtom } from '@data/transactions';

const Dangerzone = styled.div`
  border: 1px solid ${theme.palette.error.main};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.spacing(2)};
`;

const HelperText = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const StyledAccountCard = styled(AccountCard)`
  max-width: 25rem;
`;

interface AccountActionsProps {
  account: Account;
}
const AccountActions = ({ account }: AccountActionsProps) => {
  const { t } = useTranslation();
  const isAdmin = getIsAdmin(account);
  const isOwner = getIsOwner(account);
  const isShared = account?.type === AccountType.Shared;
  const isDefaultAccountSelected = account.isDefault;
  const updateAccounts = useSetAtom(accountsAtom);
  const updateTransactions = useSetAtom(transactionBaseAtom);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameInput, setRenameInput] = useState(account.accountName);

  const handleSetDefault = () => {
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: account.id })
      .then(() => updateAccounts())
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  const handleDeleteAccount = async () => {
    await fetchNui(AccountEvents.DeleteAccount, { accountId: account.id });
    await updateAccounts();
    updateTransactions();
  };

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchNui(AccountEvents.RenameAccount, { accountId: account.id, name: renameInput }).then(() =>
      updateAccounts(),
    );
    setIsRenameOpen(false);
  };

  return (
    <div>
      <StyledAccountCard account={account} withCopy />

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

        <Stack>{isShared && <SharedSettings accountId={account.id} isAdmin={isAdmin} />}</Stack>

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
      </Stack>
    </div>
  );
};

export default AccountActions;

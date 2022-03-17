import AddUserModal from '@components/Modals/AddUser';
import RemoveUserModal from '@components/Modals/RemoveUser';
import TextField from '@components/ui/Fields/TextField';
import styled from '@emotion/styled';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import {
  AccountType,
  AddToSharedAccountInput,
  RemoveFromSharedAccountInput,
} from '@typings/Account';
import { AccountEvents, SharedAccountEvents } from '@typings/Events';
import { getIsAdmin } from '@utils/account';
import { useAtom } from 'jotai';
import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionsAtom } from 'src/data/transactions';
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

const Column = styled(Stack)``;

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

const HelperText = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const Accounts = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(defaultAccount?.id ?? 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameInput, setRenameInput] = useState(selectedAccount?.accountName ?? '');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRemoveUserOpen, setIsRemoveUserOpen] = useState(false);

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
      .then(updateTransactions)
      .catch((err) => {
        console.log({ err });
      });
  };

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchNui(AccountEvents.RenameAccount, { accountId: selectedAccountId, name: renameInput }).then(
      updateAccounts,
    );
    setIsRenameOpen(false);
  };

  const handleAddUserToAccount = (id: string) => {
    const payload: AddToSharedAccountInput = {
      identifier: id,
      accountId: selectedAccountId,
    };

    fetchNui(SharedAccountEvents.AddUser, payload)
      .then(updateAccounts)
      .finally(() => setIsAddUserOpen(false));
  };

  const handleRemoveUserFromAccount = (identifier: string) => {
    const payload: RemoveFromSharedAccountInput = {
      identifier,
      accountId: selectedAccountId,
    };

    fetchNui(SharedAccountEvents.RemoveUser, payload)
      .then(updateAccounts)
      .finally(() => setIsRemoveUserOpen(false));
  };

  const isAdmin = selectedAccount && getIsAdmin(selectedAccount);
  const isShared = selectedAccount?.type === AccountType.Shared;
  const isDefaultAccountSelected = defaultAccount?.id === selectedAccountId;

  return (
    <Layout>
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSelect={handleAddUserToAccount}
      />

      <RemoveUserModal
        accountId={selectedAccountId}
        isOpen={isRemoveUserOpen}
        onClose={() => setIsRemoveUserOpen(false)}
        onSelect={handleRemoveUserFromAccount}
      />

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

      <Column spacing={5} marginTop={5}>
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

        {isShared && isAdmin && (
          <Stack spacing={1.5} alignItems="flex-start">
            <Heading5>{t('Shared settings')}</Heading5>
            <Stack direction="row" spacing={4} alignItems="flex-start">
              <Button onClick={() => setIsAddUserOpen(true)} disabled={!isAdmin}>
                {t('Add user to account')}
              </Button>

              <Button onClick={() => setIsRemoveUserOpen(true)} disabled={!isAdmin} color="error">
                {t('Remove user from account')}
              </Button>
            </Stack>
          </Stack>
        )}

        {isAdmin && (
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
      </Column>
    </Layout>
  );
};

export default Accounts;

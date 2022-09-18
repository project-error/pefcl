import AddUserModal from '@components/Modals/AddUser';
import RemoveUserModal from '@components/Modals/RemoveUser';
import Button from '@components/ui/Button';
import { Heading5 } from '@components/ui/Typography/Headings';
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  AccountRole,
  AddToSharedAccountInput,
  RemoveFromSharedAccountInput,
  SharedAccountUser,
} from '@typings/Account';
import { SharedAccountEvents } from '@typings/Events';
import { OnlineUser } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountsAtom } from 'src/data/accounts';

interface Props {
  isAdmin: boolean;
  accountId: number;
}
const SharedSettings = ({ accountId, isAdmin }: Props) => {
  const { t } = useTranslation();
  const [, updateAccounts] = useAtom(accountsAtom);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRemoveUserOpen, setIsRemoveUserOpen] = useState(false);

  const [users, setUsers] = useState<SharedAccountUser[]>([]);

  const handleUpdateUsers = useCallback(() => {
    fetchNui<SharedAccountUser[]>(SharedAccountEvents.GetUsers, { accountId }).then((users) =>
      setUsers(users ?? []),
    );
  }, [accountId]);

  const handleUpdateAccounts = () => {
    updateAccounts();
  };

  useEffect(() => {
    handleUpdateUsers();
  }, [handleUpdateUsers]);

  const handleAddUserToAccount = (user: OnlineUser, role: AccountRole) => {
    const payload: AddToSharedAccountInput = {
      role,
      accountId,
      name: user.name,
      identifier: user.identifier,
    };

    fetchNui(SharedAccountEvents.AddUser, payload)
      .then(handleUpdateAccounts)
      .then(handleUpdateUsers)
      .finally(() => setIsAddUserOpen(false));
  };

  const handleRemoveUserFromAccount = (identifier: string) => {
    const payload: RemoveFromSharedAccountInput = {
      accountId,
      identifier,
    };

    fetchNui(SharedAccountEvents.RemoveUser, payload)
      .then(handleUpdateAccounts)
      .then(handleUpdateUsers)
      .finally(() => setIsRemoveUserOpen(false));
  };

  return (
    <>
      <AddUserModal
        users={users}
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSelect={handleAddUserToAccount}
      />

      <RemoveUserModal
        accountId={accountId}
        isOpen={isRemoveUserOpen}
        onClose={() => setIsRemoveUserOpen(false)}
        onSelect={handleRemoveUserFromAccount}
      />

      <Stack spacing={5} alignItems="flex-start">
        <Stack spacing={1.5} sx={{ maxHeight: 250 }}>
          <Heading5>{t('Account users')}</Heading5>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span>{t('Name')}</span>
                  </TableCell>
                  <TableCell>
                    <span>{t('Role')}</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    hover
                    key={user.userIdentifier}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* TODO: Add (You) to yourself. */}
                    <TableCell>
                      {user.name ?? t('owner')} {/* isUserMe(user) ? t('You') : '' */}
                    </TableCell>
                    <TableCell>{t(user.role)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <Stack spacing={1.5}>
          <Heading5>{t('Shared account actions')}</Heading5>
          <Stack direction="row" spacing={4} alignItems="flex-start">
            <Button onClick={() => setIsAddUserOpen(true)} disabled={!isAdmin}>
              {t('Add user to account')}
            </Button>

            <Button onClick={() => setIsRemoveUserOpen(true)} disabled={!isAdmin} color="error">
              {t('Remove user from account')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default SharedSettings;

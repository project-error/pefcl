import Button from '@components/ui/Button';
import { Heading6 } from '@components/ui/Typography/Headings';
import UserSelect from '@components/UserSelect';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { SharedAccountEvents } from '@typings/Events';
import { AccountRole, SharedAccountUser } from '@typings/Account';
import { OnlineUser } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SelectUserModalProps {
  isOpen: boolean;
  onClose(): void;
  accountId: number;
  onSelect(identifier: string): void;
}
const RemoveUserModal = ({ isOpen, onSelect, onClose, accountId }: SelectUserModalProps) => {
  const { t } = useTranslation();
  const [selectedUserIdentifier, setSelectedUserIdentifier] = useState('');
  const [users, setUsers] = useState<SharedAccountUser[]>([]);
  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUserIdentifier(user.identifier);
  };

  const handleSubmit = () => {
    onSelect(selectedUserIdentifier);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNui<SharedAccountUser[]>(SharedAccountEvents.GetUsers, { accountId }).then((users) =>
        setUsers(users ?? []),
      );
    }
  }, [accountId, isOpen]);

  const filteredUsers = users
    .map((user) => ({
      name: user.name ?? '',
      identifier: user.userIdentifier,
      isDisabled: [AccountRole.Owner].includes(user.role),
    }))
    .filter((user) => !user.isDisabled);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth hideBackdrop maxWidth="xs">
      <DialogTitle>
        <span>{t('Remove user from a shared account')}</span>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5}>
          <Heading6>{t('Select a user')}</Heading6>
          <UserSelect onSelect={handleUserSelect} users={filteredUsers} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedUserIdentifier}>
          {t('Remove user')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveUserModal;

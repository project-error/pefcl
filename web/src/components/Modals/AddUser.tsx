import Button from '@components/ui/Button';
import Select from '@components/ui/Select';
import { Heading6 } from '@components/ui/Typography/Headings';
import UserSelect from '@components/UserSelect';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack } from '@mui/material';
import { AccountRole, SharedAccountUser } from '@typings/Account';
import { UserEvents } from '@typings/Events';
import { OnlineUser } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SelectUserModalProps {
  users: SharedAccountUser[];
  isOpen: boolean;
  onClose(): void;
  onSelect(user: OnlineUser, role: AccountRole): void;
}
const AddUserModal = ({
  isOpen,
  onSelect,
  onClose,
  users: existingUsers,
}: SelectUserModalProps) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState(AccountRole.Contributor);

  useEffect(() => {
    fetchNui<OnlineUser[]>(UserEvents.GetUsers).then((data) => data && setUsers(data));
  }, []);

  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUserId(user.identifier);
  };

  const handleSubmit = () => {
    const user = users.find((user) => user.identifier === selectedUserId);
    user && onSelect(user, selectedRole);
  };

  const filteredUsers = users.filter((user) => {
    const exists = existingUsers.find(
      (existingUser) => existingUser.userIdentifier === user.identifier,
    );
    return !exists;
  });

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth hideBackdrop maxWidth="xs">
      <DialogTitle>
        <span>{t('Add user to shared account')}</span>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1}>
          <Heading6>{t('Select a user')}</Heading6>
          <UserSelect onSelect={handleUserSelect} users={filteredUsers} />
        </Stack>
        <Stack spacing={1}>
          <Heading6>{t('Choose role')}</Heading6>
          <Select
            onChange={(event) => setSelectedRole(event.target.value as AccountRole)}
            value={selectedRole}
          >
            <MenuItem value={AccountRole.Admin}>{t('Admin')}</MenuItem>
            <MenuItem value={AccountRole.Contributor}>{t('Contributor')}</MenuItem>
          </Select>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedUserId}>
          {t('Add user')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;

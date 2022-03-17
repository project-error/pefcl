import Button from '@components/ui/Button';
import { Heading6 } from '@components/ui/Typography/Headings';
import UserSelect from '@components/UserSelect';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { UserEvents } from '@typings/Events';
import { User } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SelectUserModalProps {
  isOpen: boolean;
  onClose(): void;
  onSelect(id: string): void;
}
const AddUserModal = ({ isOpen, onSelect, onClose }: SelectUserModalProps) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchNui<string[]>(UserEvents.GetUsers).then((data) => data && setUsers(data));
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUserId(user.identifier);
  };

  const handleSubmit = () => {
    onSelect(selectedUserId);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth hideBackdrop maxWidth="xs">
      <DialogTitle>
        <span>{t('Add user to shared account')}</span>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1}>
          <Heading6>{t('Select a user')}</Heading6>
          <UserSelect
            onSelect={handleUserSelect}
            users={users.map((identifier) => ({ identifier }))}
          />
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

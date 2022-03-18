import { Autocomplete, FormHelperText, Stack } from '@mui/material';
import { User } from '@typings/user';
import React, { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from './ui/Fields/TextField';

interface SelectableUser extends User {
  isDisabled?: boolean;
}
interface UserSelectProps {
  users: SelectableUser[];
  isDisabled?: boolean;
  selectedId?: string;
  onSelect(user?: SelectableUser): void;
}

const UserSelect = ({ users, onSelect }: UserSelectProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('');

  const handleChange = (_event: SyntheticEvent<Element, Event>, value: string | null) => {
    const selectedUser = users.find((user) => user.name === value);
    if (!selectedUser || !value) {
      return;
    }
    setValue(value);
    onSelect(selectedUser);
  };

  return (
    <Stack spacing={1.5}>
      <Autocomplete
        freeSolo
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} placeholder={t('Search for a user')} />}
        disableClearable
        sx={{ width: '100%' }}
        options={users.map((user) => user.name)}
      />
      {users.length === 0 && <FormHelperText color="red">{t('No users found.')}</FormHelperText>}
    </Stack>
  );
};

export default UserSelect;

import { Autocomplete } from '@mui/material';
import { User } from '@typings/user';
import { t } from 'i18next';
import React, { SyntheticEvent, useState } from 'react';
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
  const [value, setValue] = useState<string>('');

  const handleChange = (event: SyntheticEvent<Element, Event>, value: string | null) => {
    const selectedUser = users.find((user) => user.name === value);
    if (!selectedUser || !value) {
      return;
    }
    setValue(value);
    onSelect(selectedUser);
  };

  return (
    <div>
      <Autocomplete
        id="account-select"
        value={value}
        onChange={handleChange}
        freeSolo
        renderInput={(params) => <TextField {...params} placeholder={t('Search for a user')} />}
        disableClearable
        sx={{ width: '100%' }}
        options={users.map((user) => user.name)}
      />
    </div>
  );
};

export default UserSelect;

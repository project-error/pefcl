import styled from '@emotion/styled';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { InputBase, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { OnlineUser } from '@typings/user';
import { t } from 'i18next';
import React, { useState } from 'react';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading6 } from './ui/Typography/Headings';

const StyledInput = styled(InputBase)`
  border-radius: ${theme.spacing(1)};
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.dark12};

  & > div {
    padding: 0.75rem 1rem;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &.Mui-selected {
    background: ${theme.palette.background.dark12};
  }

  &.Mui-selected,
  &.Mui-selected:disabled,
  &:disabled {
    color: #fff;
    span {
      color: #fff;
    }
    background: ${theme.palette.background.dark12};
  }

  &.Mui-selected:disabled,
  &.Mui-selected:focus-visible,
  &.Mui-selected:focus,
  &.Mui-selected:hover {
    background: ${theme.palette.background.dark12};
  }

  &.Mui-focusVisible {
    background: ${theme.palette.background.dark4};
  }
`;

const SelectIcon = styled(ArrowDropDownRounded)`
  color: ${theme.palette.text.primary};
  color: white !important;
  margin-right: 0.5rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 0.75rem;
`;

const Option: React.FC<{ user: SelectableUser }> = ({ user }) => {
  return (
    <ListItem>
      <Stack p="0rem 0.5rem">
        <BodyText>{user.name}</BodyText>
      </Stack>
    </ListItem>
  );
};

interface SelectableUser extends OnlineUser {
  isDisabled?: boolean;
}
interface UserSelectProps {
  users: SelectableUser[];
  isDisabled?: boolean;
  selectedId?: string;
  onSelect(user?: SelectableUser): void;
}

const UserSelect = ({ users, onSelect, selectedId, isDisabled }: UserSelectProps) => {
  const [selected, setSelected] = useState<string>('0');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(users.find((user) => user.identifier === value));
  };

  return (
    <div>
      <Select
        id="account-select"
        value={selected}
        onChange={handleChange}
        variant="filled"
        input={<StyledInput sx={{ border: 'none', outline: 'none' }} placeholder="select" />}
        sx={{ width: '100%' }}
        IconComponent={(props) => {
          return <SelectIcon {...props} />;
        }}
      >
        {selected === '0' && (
          <MenuItem value={'0'} disabled>
            <ListItem>
              <Stack p="0rem 0.5rem">
                {users.length > 0 && <Heading6>{t('Select a user')}</Heading6>}
                {users.length === 0 && <Heading6>{t('No users found')}</Heading6>}
              </Stack>
            </ListItem>
          </MenuItem>
        )}

        {users.map((user) => (
          <StyledMenuItem
            key={user.identifier}
            value={user.identifier}
            disabled={selectedId === user.identifier || isDisabled}
          >
            <Option user={user} />
          </StyledMenuItem>
        ))}
      </Select>
    </div>
  );
};

export default UserSelect;

import React from 'react';
import { useSetFilteredAccounts } from '../hooks/accounts.state';
import { Icon, InputBase, Paper, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledBase = styled(Paper)({
  marginBottom: 10,
  paddingBottom: 4,
  paddingTop: 4,
  display: 'flex',
  alignItems: 'center',
});

const AccountSearchbar: React.FC = () => {
  const setFilteredAccounts = useSetFilteredAccounts();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredAccounts(e.currentTarget.value);
  };

  return (
    <StyledBase>
      <InputBase sx={{ pl: 1, flex: 1 }} onChange={handleSearchChange} />
      <SearchIcon sx={{ pr: 1 }} />
    </StyledBase>
  );
};

export default AccountSearchbar;
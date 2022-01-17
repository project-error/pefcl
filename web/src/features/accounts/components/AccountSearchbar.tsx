import React from 'react';
import { useSetFilterAccounts } from '../hooks/accounts.state';
import { InputBase, Paper, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledBase = styled(Paper)({
  marginBottom: 10,
  paddingBottom: 4,
  paddingTop: 4,
  display: 'flex',
  alignItems: 'center',
});

const AccountSearchbar: React.FC = () => {
  const setFilteredAccounts = useSetFilterAccounts();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredAccounts(e.currentTarget.value);
  };

  return (
    <StyledBase>
      <InputBase
        placeholder="Search for accounts"
        name="filter-accounts"
        sx={{ pl: 1, flex: 1 }}
        onChange={handleSearchChange}
      />
      <SearchIcon sx={{ pr: 1 }} />
    </StyledBase>
  );
};

export default AccountSearchbar;

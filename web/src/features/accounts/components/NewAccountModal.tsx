import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useAccountAPI } from '../api/useAccountAPI';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose }) => {
  const [accountName, setAccountName] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const { createAccount } = useAccountAPI();

  const handleCreateAccount = () => {
    if (!accountName) return setError(true);
    createAccount(accountName);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New account</DialogTitle>
      <DialogContent>
        <TextField
          error={error}
          placeholder="Account name"
          fullWidth
          onChange={(e) => setAccountName(e.currentTarget.value)}
          value={accountName}
        />
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleCreateAccount}>
          Create account
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewAccountModal;

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose }) => {
  const [accountName, setAccountName] = useState<string>('');
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New account</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Account name"
          fullWidth
          onChange={(e) => setAccountName(e.currentTarget.value)}
          value={accountName}
        />
        <Button sx={{ mt: 2 }} variant="contained">
          Create account
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewAccountModal;

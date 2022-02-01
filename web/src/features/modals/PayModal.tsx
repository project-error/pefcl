import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccountsValue } from '../accounts/hooks/accounts.state';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IconTextField from '../../components/IconTextField';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface PayModalProps {
  open: boolean;
  onClose: () => void;
}

const PayModal: React.FC<PayModalProps> = ({ open, onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);

  const [t] = useTranslation();

  const accounts = useAccountsValue();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: 'background.default' }}>
        {t('modal.pay.title')}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: 'background.default' }}>
        <DialogContentText>{t('modal.pay.contextText')}</DialogContentText>
        <Box mt={2}>
          <Autocomplete
            getOptionLabel={(account) => account.accountName}
            groupBy={(account) => account.type.toUpperCase()}
            renderInput={(props) => (
              <TextField placeholder={t('modal.pay.selectAccount')} variant="standard" {...props} />
            )}
            options={accounts}
          />
        </Box>
        <Box mt={4}>
          <IconTextField
            value={amount}
            onChange={(e) => setAmount(parseInt(e.currentTarget.value, 10))}
            fullWidth
            type="number"
            variant="standard"
            icon={<AttachMoneyIcon sx={{ color: 'white' }} />}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PayModal;

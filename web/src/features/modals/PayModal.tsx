import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccountsValue } from '../accounts/hooks/accounts.state';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IconTextField from '../../components/IconTextField';
import { Autocomplete } from '../../components/Autocomplete/Autocomplete';
import { Account } from '../../../../typings/accounts';

interface PayModalProps {
  open: boolean;
  onClose: () => void;
}

const PayModal: React.FC<PayModalProps> = ({ open, onClose }) => {
  /*const [selectedAccount, setSelectedAccount] = useState<Account>(null);*/
  const [amount, setAmount] = useState<number>(0);

  const [t] = useTranslation();

  const accounts = useAccountsValue();

  const handleSelectedAccount = (account: Account) => {
    // do something
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: 'background.default' }}>
        {t('modal.pay.title')}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: 'background.default' }}>
        <DialogContentText>{t('modal.pay.contextText')}</DialogContentText>
        <Box mt={2}>
          <Autocomplete onChange={handleSelectedAccount} data={accounts} />
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

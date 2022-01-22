import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import IconLabelButton from '../../components/IconLabelButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useActiveAccountValue } from '../accounts/hooks/accounts.state';
import DetailsSkeleton from './components/DetailsSkeleton';
import { AccountType } from '../../../../typings/accounts';
import { useTranslation } from 'react-i18next';
import PermissionsModal from '../permissions/PermissionsModal';

const BankDetails: React.FC = () => {
  const [permissionModal, setPermissionModal] = useState<boolean>(false);

  const account = useActiveAccountValue();
  const [t] = useTranslation();

  const openPermissionModal = () => {
    setPermissionModal(true);
  };

  const closePermissionModal = () => {
    setPermissionModal(false);
  };

  if (!account) return <DetailsSkeleton />;

  return (
    <>
      <PermissionsModal open={permissionModal} onClose={closePermissionModal} />
      <Stack direction="row" spacing={4}>
        <Box>
          <Box sx={{ mt: -1 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {t('details.balance')}
            </Typography>
          </Box>
          <Typography variant="h4" style={{ fontWeight: 'bold' }} sx={{ color: 'text.primary' }}>
            ${account.balance}
          </Typography>
        </Box>
        {account.type === AccountType.Personal && (
          <Box>
            <IconLabelButton
              onClick={openPermissionModal}
              variant="contained"
              size="small"
              icon={<SettingsIcon />}
            >
              {t('details.permissions')}
            </IconLabelButton>
          </Box>
        )}
      </Stack>
      {/*
      <Box>
        <List>
          {MockTransactions.map((t) => (
            <TransactionItem {...t} />
          ))}
        </List>
      </Box>
*/}
    </>
  );
};

export default BankDetails;

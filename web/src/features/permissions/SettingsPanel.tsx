import React from 'react';
import IconLabelButton from '../../components/IconLabelButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAccountAPI } from '../accounts/api/useAccountAPI';
import { useActiveAccountValue } from '../accounts/hooks/accounts.state';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { deleteAccount } = useAccountAPI();
  const activeAccount = useActiveAccountValue();

  const handleDeleteAccount = async () => {
    activeAccount && deleteAccount(activeAccount);
    onClose();
  };

  return (
    <div>
      <IconLabelButton onClick={handleDeleteAccount} variant="contained" icon={<DeleteIcon />}>
        Delete
      </IconLabelButton>
    </div>
  );
};

export default SettingsPanel;

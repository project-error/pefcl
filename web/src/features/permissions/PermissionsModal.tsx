import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SettingsPanel from './SettingsPanel';

interface PermissionsModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [t] = useTranslation();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t('permissions.dialogTitle')}</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label={t('permissions.tabs.access')} />
          <Tab label={t('permissions.tabs.settings')} />
        </Tabs>
        <TabPanel index={0} value={tabValue}></TabPanel>
        <TabPanel index={1} value={tabValue}>
          <SettingsPanel onClose={onClose} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsModal;

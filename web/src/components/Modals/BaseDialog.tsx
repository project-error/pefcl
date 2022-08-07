import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Dialog, DialogProps } from '@mui/material';
import React, { ReactNode } from 'react';

interface BaseDialogProps extends DialogProps {
  children: ReactNode;
}
const BaseDialog = (props: BaseDialogProps) => {
  const { isMobile } = useGlobalSettings();

  return (
    <Dialog
      {...props}
      fullWidth
      hideBackdrop
      disablePortal={isMobile}
      fullScreen={isMobile}
      sx={{ position: isMobile ? 'absolute' : 'fixed', height: '100%' }}
    >
      {props.children}
    </Dialog>
  );
};

export default BaseDialog;

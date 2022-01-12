import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface IconLabelButtonProps extends ButtonProps {
  icon: JSX.Element;
}

const IconLabelButton: React.FC<IconLabelButtonProps> = ({ children, icon, ...props }) => (
  <Button {...props} endIcon={icon}>
    {children}
  </Button>
);

export default IconLabelButton;

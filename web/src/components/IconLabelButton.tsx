import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styled from '@emotion/styled';

interface IconLabelButtonProps extends ButtonProps {
  icon: JSX.Element;
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
}

const IconLabelButton: React.FC<IconLabelButtonProps> = ({ children, icon, ...props }) => (
  <Button {...props} endIcon={icon}>
    {children}
  </Button>
);

const IconButtonWrapper = styled('button')({
  background: '#d84e4b',
  display: 'inline',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  padding: '3px 20px',
  fontWeight: 500,
  fontSize: 16,
});

export const IconButton: React.FC<IconButtonProps> = ({ children, icon, ...props }) => {
  return (
    <IconButtonWrapper {...props}>
      {children}
      {icon}
    </IconButtonWrapper>
  );
};

export default IconLabelButton;

// import styled from '@emotion/styled';
import styled from '@emotion/styled';
import { ButtonProps } from '@mui/material';
import { Button as ButtonBase } from '@mui/material';
import React from 'react';
import theme from '../../utils/theme';

const StyledButtonBase = styled(ButtonBase)`
  font-weight: 200;
  box-shadow: none;
  border-radius: ${theme.spacing(1)};
  color: ${theme.palette.primary.main};
  background-color: rgba(255, 255, 255, 0.04);
  padding: 0.35rem 2rem;

  :disabled {
    opacity: 0.35;
    color: ${theme.palette.primary.main};
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButtonBase {...props}>{children}</StyledButtonBase>;
};

export default Button;

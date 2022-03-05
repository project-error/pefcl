// import styled from '@emotion/styled';
import styled from '@emotion/styled';
import { ButtonProps, css } from '@mui/material';
import { Button as ButtonBase } from '@mui/material';
import React from 'react';
import theme from '../../utils/theme';

const colors = {
  inherit: '',
  secondary: '',
  success: '',
  info: '',
  warning: '',
  error: css`
    background-color: rgba(255, 77, 77, 0.14);
  `,
  primary: css``,
};

const StyledButtonBase = styled(ButtonBase)`
  font-weight: 200;
  box-shadow: none;
  border-radius: ${theme.spacing(1)};
  background-color: #1d2a3a;
  padding: 0.35rem 2rem;

  ${({ color }) => colors[color ?? 'primary']};

  :disabled {
    opacity: 0.35;
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButtonBase {...props} color={props.color || 'primary'}>
      {children}
    </StyledButtonBase>
  );
};

export default Button;

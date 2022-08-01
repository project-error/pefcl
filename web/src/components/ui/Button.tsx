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
    color: ${theme.palette.error.main};
    background-color: rgba(255, 77, 77, 0.14);
  `,
  primary: css`
    color: ${theme.palette.primary.main};
  `,
};

const StyledButtonBase = styled(ButtonBase)`
  font-weight: 200;
  box-shadow: none;
  border-radius: ${theme.spacing(1)};
  background-color: #1d2a3a;
  padding: 0.4rem 2rem;

  ${({ color }) => colors[color ?? 'primary']};

  :disabled {
    opacity: 0.25;
    ${({ color }) => colors[color ?? 'primary']};
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

import React from 'react';
import styled from '@emotion/styled';

const MainButton = styled('button')({
  background: '#42464A',
  border: 'none',
  color: '#fff',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: 7,
  minWidth: '100px',
  fontSize: 18,
  cursor: 'pointer',
});

const Button: React.FC = ({ children }) => {
  return <MainButton>{children}</MainButton>;
};

export default Button;

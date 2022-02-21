import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: JSX.Element;
}

const MainButton = styled.button<ButtonProps>`
  background: #42464a;
  border: none;
  color: #fff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 0.3em 1.8em;
  box-sizing: border-box;

  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
  text-transform: uppercase;
  justify-content: space-between;
`;

const Button: React.FC<ButtonProps> = ({ icon, children, ...props }) => {
  return (
    <MainButton {...props}>
      {children}

      {icon && <span style={{ marginLeft: 10 }}>{icon}</span>}
    </MainButton>
  );
};

export default Button;

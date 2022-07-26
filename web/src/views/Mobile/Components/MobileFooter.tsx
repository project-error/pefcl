import styled from '@emotion/styled';
import { AccountBalance } from '@mui/icons-material';
import { Badge } from '@mui/material';
import theme from '@utils/theme';
import React, { ReactNode } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

export const FooterHeight = '5rem';
const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${FooterHeight};
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #244978;
`;

const List = styled.ul`
  flex: 1;
  padding: 0 1rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  list-style: none;
  margin: 0;

  a {
    text-decoration: none;
  }
`;

const ListItemContainer = styled.li<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: ${theme.spacing(1)};
  border-radius: ${theme.spacing(1)};
  color: ${theme.palette.text.secondary};

  transition: 250ms;

  width: 4rem;
  height: 4rem;

  :hover {
    background-color: ${theme.palette.background.light2};
  }

  :active {
    color: ${theme.palette.primary.main};
    background-color: ${theme.palette.background.light4};
  }

  ${({ isActive }) =>
    isActive &&
    `
      color: ${theme.palette.primary.main};
      background-color: ${theme.palette.background.light4};
  `};

  span {
    font-weight: 400;
    margin-top: ${theme.spacing(0.75)};
    font-size: 0.725rem;
  }
`;

interface ListItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  amount?: number;
}
const ListItem = ({ to, icon, label, amount }: ListItemProps) => {
  const match = useRouteMatch();
  console.log({ match });

  return (
    <Link to={to}>
      <ListItemContainer isActive={match.url === to}>
        <Badge color="error" badgeContent={amount}>
          {icon}
        </Badge>
        <span>{label}</span>
      </ListItemContainer>
    </Link>
  );
};

const MobileFooter = () => {
  return (
    <Container>
      <List>
        <ListItem icon={<AccountBalance />} label="Accounts" to="/accounts" />
        <ListItem icon={<AccountBalance />} label="Other" to="/other" />
        <ListItem icon={<AccountBalance />} label="Dashboard" to="/dashboard" />
        <ListItem icon={<AccountBalance />} label="Other" to="/other" />
        <ListItem icon={<AccountBalance />} label="Other" to="/other" />
      </List>
    </Container>
  );
};

export default MobileFooter;

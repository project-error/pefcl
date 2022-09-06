import React, { ReactNode } from 'react';
import {
  Add,
  CreditCardRounded,
  DashboardRounded,
  Paid,
  Receipt,
  Remove,
  SwapHoriz,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { Badge } from '@mui/material';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Atom } from 'jotai';
import { totalUnpaidInvoicesAtom } from '@data/invoices';
import BadgeAtom from './ui/BadgeAtom';

const List = styled.ul`
  margin: 0;
  padding: 2rem 1rem;
  list-style: none;
  background-color: ${theme.palette.background.dark12};

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

  padding: ${theme.spacing(2)};
  border-radius: ${theme.spacing(1.5)};
  margin: 0.5rem;
  color: ${theme.palette.text.secondary};

  transition: 250ms;

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
  countAtom?: Atom<number>;
}
const ListItem = ({ to, icon, label, amount, countAtom }: ListItemProps) => {
  const match = useRouteMatch();

  return (
    <Link to={to}>
      <ListItemContainer isActive={match.url === to}>
        {countAtom ? (
          <BadgeAtom color="error" countAtom={countAtom}>
            {icon}
          </BadgeAtom>
        ) : (
          <Badge color="error" badgeContent={amount}>
            {icon}
          </Badge>
        )}

        <span>{label}</span>
      </ListItemContainer>
    </Link>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <List>
      <ListItem to="/" icon={<DashboardRounded />} label={t('Dashboard')} />
      <ListItem to="/accounts" icon={<CreditCardRounded />} label={t('Accounts')} />
      <ListItem to="/transfer" icon={<SwapHoriz />} label={t('Transfer')} />
      <ListItem to="/transactions" icon={<Paid />} label={t('Transactions')} />
      <ListItem
        to="/invoices"
        icon={<Receipt />}
        label={t('Invoices')}
        countAtom={totalUnpaidInvoicesAtom}
      />
      <ListItem to="/deposit" icon={<Add />} label={t('Deposit')} />
      <ListItem to="/withdraw" icon={<Remove />} label={t('Withdraw')} />
    </List>
  );
};

export default Sidebar;

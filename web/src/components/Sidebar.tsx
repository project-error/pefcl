import React, { ReactNode } from 'react';
import { CreditCardRounded, DashboardRounded, Paid, Receipt, SwapHoriz } from '@mui/icons-material';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { Badge } from '@mui/material';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { invoicesAtom, totalUnpaidInvoices } from '@data/invoices';

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
}
const ListItem = ({ to, icon, label, amount }: ListItemProps) => {
  const match = useRouteMatch();

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

const Sidebar = () => {
  const { t } = useTranslation();
  const [count] = useAtom(totalUnpaidInvoices);

  return (
    <List>
      <ListItem to="/" icon={<DashboardRounded />} label={t('Dashboard')} />
      <ListItem to="/accounts" icon={<CreditCardRounded />} label={t('Accounts')} />
      <ListItem to="/transfer" icon={<SwapHoriz />} label={t('Transfer')} />
      <ListItem to="/transactions" icon={<Paid />} label={t('Transactions')} />
      <ListItem to="/invoices" icon={<Receipt />} label={t('Invoices')} amount={count} />
    </List>
  );
};

export default Sidebar;

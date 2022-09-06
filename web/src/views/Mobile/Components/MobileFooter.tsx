import styled from '@emotion/styled';
import {
  CreditCardRounded,
  DashboardRounded,
  ReceiptRounded,
  SwapHorizRounded,
} from '@mui/icons-material';
import { Badge } from '@mui/material';
import theme from '@utils/theme';
import React, { ReactNode } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { externalAppConfig } from 'npwd.config';
import { useTranslation } from 'react-i18next';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Atom } from 'jotai';
import { totalUnpaidInvoicesAtom } from '@data/invoices';
import BadgeAtom from '@components/ui/BadgeAtom';

export const FooterHeight = '5rem';
const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${FooterHeight};
  position: absolute;
  bottom: -1px;
  left: 0;
  background-color: #244978;
`;

const List = styled.ul`
  flex: 1;
  padding: 0 1.25rem;

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

  opacity: 0.5;

  width: 5rem;
  height: 4rem;

  :hover {
    opacity: 0.8;
    background-color: ${theme.palette.background.light8};
  }

  :active {
    color: ${theme.palette.primary.main};
    background-color: ${theme.palette.background.light4};
  }

  ${({ isActive }) =>
    isActive &&
    `
      opacity: 1;
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
  const match = useRouteMatch(to);

  return (
    <Link to={to}>
      <ListItemContainer isActive={match?.url === to}>
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

const MobileFooter = () => {
  const { t } = useTranslation();
  const settings = useGlobalSettings();
  const prefix = settings.isMobile ? externalAppConfig().path : '';

  return (
    <Container>
      <List>
        <ListItem icon={<DashboardRounded />} label={t('Dashboard')} to={`${prefix}/dashboard`} />
        <ListItem icon={<CreditCardRounded />} label={t('Accounts')} to={`${prefix}/accounts`} />
        <ListItem icon={<SwapHorizRounded />} label={t('Transfer')} to={`${prefix}/transfer`} />
        <ListItem
          icon={<ReceiptRounded />}
          label={t('Invoices')}
          to={`${prefix}/invoices`}
          countAtom={totalUnpaidInvoicesAtom}
        />
      </List>
    </Container>
  );
};

export default MobileFooter;

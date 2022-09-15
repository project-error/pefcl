import { Stack } from '@mui/material';
import { Card, InventoryCard } from '@typings/BankCard';
import theme from '@utils/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MasterCardIcon } from 'src/icons/MasterCardIcon';
import styled from 'styled-components';
import { BodyText } from './ui/Typography/BodyText';
import { Heading4, Heading6 } from './ui/Typography/Headings';

const Container = styled.div<{ selected: boolean; blocked: boolean }>`
  user-select: none;
  width: 100%;
  padding: 1rem;
  background: ${({ blocked }) =>
    blocked
      ? 'linear-gradient(90deg, #bcbcbc 0%, #b0b0b0 100%)'
      : 'linear-gradient(90deg, #fc5f02 0%, #f43200 100%)'};

  min-height: 7rem;
  width: auto;
  border-radius: ${theme.spacing(1)};

  cursor: pointer;
  transition: 250ms;
  box-shadow: ${theme.shadows[4]};

  :hover {
    box-shadow: ${theme.shadows[6]};
  }

  transition: 200ms ease-in-out;
  border: 2px solid transparent;

  ${({ selected }) => selected && `border: 2px solid ${theme.palette.text.primary}`}
`;

const StyledIcon = styled(MasterCardIcon)`
  color: rgba(255, 255, 255, 0.54);
  align-self: flex-end;
`;

interface BankCardProps {
  card: Card | InventoryCard;
  isBlocked?: boolean;
  selected?: boolean;
}
const BankCard = ({ card, selected = false, isBlocked = false }: BankCardProps) => {
  const { t } = useTranslation();

  return (
    <Container selected={selected} blocked={isBlocked}>
      <Stack spacing={3}>
        <Heading4>{card.number}</Heading4>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Heading6>{t('Card holder')}</Heading6>
            <BodyText>{card.holder}</BodyText>
          </Stack>

          <StyledIcon />
        </Stack>
      </Stack>
    </Container>
  );
};

export default BankCard;

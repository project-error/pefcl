import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading1 } from '@components/ui/Typography/Headings';
import React, { useEffect, useState } from 'react';
import BankCard from '@components/BankCard';
import { AddRounded, ErrorRounded, InfoRounded } from '@mui/icons-material';
import { Alert, Backdrop, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Card, CreateCardInput } from '@typings/BankCard';
import theme from '@utils/theme';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CardActions from './CardActions';
import { useConfig } from '@hooks/useConfig';
import BaseDialog from '@components/Modals/BaseDialog';
import { fetchNui } from '@utils/fetchNui';
import { CardEvents } from '@typings/Events';
import { useAtom } from 'jotai';
import { cardsAtom } from '@data/cards';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@components/ui/Button';
import AccountSelect from '@components/AccountSelect';
import Summary from '@components/Summary';
import { accountsAtom } from '@data/accounts';
import PinField from '@components/ui/Fields/PinField';

const CreateCard = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.spacing(1)};
  border: 1px dashed ${theme.palette.grey[500]};
  font-size: 1.75rem;
  transition: 300ms;

  min-height: 7rem;
  width: auto;

  :hover {
    color: ${theme.palette.primary.main};
    border: 1px dashed ${theme.palette.primary.main};
  }

  svg {
    font-size: 2.5rem;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  overflow: auto;
  margin-top: 1rem;
  margin-left: -0.5rem;

  & > div {
    width: calc(33% - 0.5rem);
    margin-left: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const Modal = styled(motion.div)`
  z-index: 2;
  padding: 2rem 3rem;
  position: absolute;
  width: calc(100% - 5rem);
  height: 100%;
  top: 0;
  left: 5rem;
  background-color: ${theme.palette.background.paper};
`;

interface BankCardsProps {
  accountId: number;
  selectedCardId: number;
  onSelectCardId(id: number): void;
}

const BankCards = ({ onSelectCardId, selectedCardId, accountId }: BankCardsProps) => {
  const { t } = useTranslation();
  const [accounts] = useAtom(accountsAtom);
  const defaultAccount = accounts.find((account) => Boolean(account.isDefault));
  const initialAccountId = defaultAccount?.id ?? -1;
  const [cards, updateCards] = useAtom(cardsAtom);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderingCard, setIsOrderingCard] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccountId);
  const {
    cards: { cost, maxCardsPerAccount },
  } = useConfig();

  useEffect(() => {
    updateCards(accountId);
  }, [accountId, updateCards]);

  const handleClose = () => {
    setError('');
    setIsLoading(false);
    setIsOrderingCard(false);
    setPin('');
    setConfirmPin('');
  };

  const handleOrderCard = async () => {
    if (confirmPin !== pin) {
      setError(t('Pins do not match'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const newCard = await fetchNui<Card, CreateCardInput>(CardEvents.OrderPersonal, {
        accountId,
        paymentAccountId: selectedAccountId,
        pin: parseInt(pin, 10),
      });

      if (!newCard) {
        return;
      }

      updateCards(newCard);
      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }

    setIsLoading(false);
  };

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
  const selectedCard = cards.find((card) => card.id === selectedCardId);
  const isAffordable = (selectedAccount?.balance ?? 0) > cost;

  return (
    <Stack direction="row" spacing={4} height="100%">
      <Stack flex="1" alignSelf="flex-start" maxHeight="100%">
        <Stack>
          <Heading1>{t('Cards')}</Heading1>
          <PreHeading>{t('Select a card to handle, or order a new one.')}</PreHeading>
        </Stack>

        <CardContainer>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                !card.isBlocked && onSelectCardId(card.id);
              }}
            >
              <BankCard card={card} selected={selectedCardId === card.id} />
            </div>
          ))}

          {cards.length < maxCardsPerAccount && (
            <CreateCard onClick={() => setIsOrderingCard(true)}>
              <Stack spacing={1}>
                <AddRounded />
              </Stack>
            </CreateCard>
          )}
        </CardContainer>
      </Stack>

      <Backdrop
        open={Boolean(selectedCardId)}
        onClick={() => {
          onSelectCardId(0);
        }}
        sx={{ position: 'absolute', left: '-2rem' }}
      />

      <AnimatePresence>
        {Boolean(selectedCardId) && (
          <Modal animate={{ x: 0 }} initial={{ x: 100 }} exit={{ x: 200, opacity: 0 }}>
            <CardActions
              isBlocked={selectedCard?.isBlocked}
              cardId={selectedCardId}
              onBlock={() => {
                updateCards(accountId);
                onSelectCardId(0);
              }}
              onDelete={() => {
                updateCards(accountId);
                onSelectCardId(0);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>

      <BaseDialog open={isOrderingCard} onClose={handleClose}>
        <DialogTitle>{t('Order a new card')}</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={4}>
            <Stack spacing={2.5}>
              <PinField
                label={t('Enter pin')}
                value={pin}
                onChange={(event) => setPin(event.target.value)}
              />

              <PinField
                label={t('Confirm pin')}
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value)}
              />
            </Stack>

            <Stack spacing={2} flex={1}>
              <AccountSelect
                isFromAccount
                accounts={accounts}
                selectedId={selectedAccountId}
                onSelect={setSelectedAccountId}
              />

              <Summary balance={selectedAccount?.balance ?? 0} payment={cost} />
            </Stack>
          </Stack>

          {error && (
            <Alert
              sx={{ marginTop: '2rem' }}
              icon={isLoading ? <InfoRounded /> : <ErrorRounded />}
              color={isLoading ? 'info' : 'error'}
            >
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleOrderCard} disabled={isLoading || !isAffordable}>
            {t('Order new card')}
          </Button>
        </DialogActions>
      </BaseDialog>
    </Stack>
  );
};

export default BankCards;

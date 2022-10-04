import Button from '@components/ui/Button';
import { Heading2, Heading4, Heading6 } from '@components/ui/Typography/Headings';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Alert, Paper, Stack } from '@mui/material';
import { Account, ATMInput, GetATMAccountInput } from '@typings/Account';
import { AccountEvents, CardEvents } from '@typings/Events';
import { defaultWithdrawOptions } from '@utils/constants';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { AnimatePresence } from 'framer-motion';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNuiEvent } from 'react-fivem-hooks';
import { PIN_CODE_LENGTH } from '@shared/constants';
import PinField from '@components/ui/Fields/PinField';
import { CardErrors } from '@typings/Errors';
import { ErrorRounded } from '@mui/icons-material';
import { Card, InventoryCard } from '@typings/BankCard';
import BankCard from '@components/BankCard';
import { useKeyDown } from '@hooks/useKeyPress';
import { useExitListener } from '@hooks/useExitListener';
import { useAtomValue } from 'jotai';
import { defaultAccountAtom } from '@data/accounts';

const AnimationContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
`;

const Container = styled(Paper)`
  display: inline-block;
  padding: ${theme.spacing(7)};
  border-radius: ${theme.spacing(3)};
`;

const AccountBalance = styled(Heading6)`
  color: ${theme.palette.text.primary};
  font-weight: ${theme.typography.fontWeightLight};
`;

const Header = styled(Stack)`
  margin-bottom: ${theme.spacing(5)};
`;

const WithdrawText = styled(Heading6)`
  display: block;
  padding-bottom: ${theme.spacing(1.5)};
`;

const WithdrawContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 8rem);
  grid-row-gap: ${theme.spacing(1.5)};
  grid-column-gap: ${theme.spacing(1.5)};
`;

const CardWrapper = styled.div`
  min-width: 15rem;
`;

type BankState = 'select-card' | 'enter-pin' | 'withdraw';

const ATM = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const { isCardsEnabled } = config.frameworkIntegration;
  const defaultAccount = useAtomValue(defaultAccountAtom);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account>();
  const [isOpen, setIsOpen] = useState(false);

  const initialStatus: BankState = isCardsEnabled ? 'select-card' : 'withdraw';

  const [selectedCard, setSelectedCard] = useState<InventoryCard>();
  const [cards, setCards] = useState<InventoryCard[]>([]);
  const [state, setState] = useState<BankState>(initialStatus);
  const [pin, setPin] = useState('');

  useExitListener(state === 'withdraw' || state === initialStatus);

  const withdrawOptions = config?.atms?.withdrawOptions ?? defaultWithdrawOptions;

  const handleClose = () => {
    setError('');
    setPin('');
    setAccount(undefined);
    setState(initialStatus);
  };

  const handleBack = () => {
    setError('');
    setPin('');
    if (state === 'enter-pin') {
      setState('select-card');
    }
  };

  useKeyDown(['Escape'], handleBack);

  const handleVisibility = (isOpen: boolean) => {
    setIsOpen(isOpen);

    if (!isOpen) {
      handleClose();
    }
  };

  useEffect(() => {
    const updateCards = async () => {
      try {
        const cards = await fetchNui<InventoryCard[]>(CardEvents.GetInventoryCards);
        if (!cards) {
          throw new Error('No cards available');
        }
        setCards(cards);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t('Something went wrong, please try again later.'));
        }
      }
    };

    isCardsEnabled && isOpen && updateCards();
  }, [t, isCardsEnabled, isOpen]);

  useNuiEvent<boolean>({
    event: 'setVisibleATM',
    defaultValue: false,
    callback: handleVisibility,
  });

  const input = {
    cardId: selectedCard?.id ?? 0,
    pin: parseInt(pin, 10),
  };

  const handleUpdateBalance = async () => {
    setError('');
    const response = await fetchNui<{ account: Account; card: Card }, GetATMAccountInput>(
      AccountEvents.GetAtmAccount,
      input,
    );

    if (!response) {
      return;
    }

    const { card, account } = response;
    setSelectedCard(card);
    setAccount(account);
  };

  const handleWithdraw = async (amount: number) => {
    const withdrawAccount = isCardsEnabled ? account : defaultAccount;
    if (!withdrawAccount) {
      return;
    }

    const accountId = withdrawAccount.id;

    const payload: ATMInput = isCardsEnabled
      ? {
          amount,
          cardId: selectedCard?.id,
          cardPin: parseInt(pin, 10),
          accountId,
          message: t('Withdrew {{amount}} from an ATM with card {{cardNumber}}.', {
            amount,
            cardNumber: selectedCard?.number ?? 'unknown',
          }),
        }
      : {
          amount,
          accountId,
          message: t('Withdrew {{amount}} from an ATM.', {
            amount,
          }),
        };

    setIsLoading(true);

    try {
      setError('');
      await fetchNui(AccountEvents.WithdrawMoney, payload);
      await handleUpdateBalance();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === CardErrors.InvalidPin) {
          setError(t('Invalid pin'));
          return;
        }

        if (error.message === CardErrors.Blocked) {
          setError(t('The card is blocked'));
          return;
        }

        setError(error.message);
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isCardsEnabled) {
      return;
    }

    if (pin.length === PIN_CODE_LENGTH && selectedCard?.id) {
      try {
        setError('');
        const response = await fetchNui<{ account: Account; card: Card }, GetATMAccountInput>(
          AccountEvents.GetAtmAccount,
          input,
        );

        if (!response) {
          return;
        }

        const { card, account } = response;
        setSelectedCard(card);
        setAccount(account);
        setState('withdraw');
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === CardErrors.InvalidPin) {
            setError(t('Invalid pin'));
            return;
          }

          if (error.message === CardErrors.Blocked) {
            setError(t('The card is blocked'));
            return;
          }

          setError(error.message);
        } else {
          setError(t('Something went wrong, please try again later.'));
        }
      }
    }
  };

  const handleSelectCard = (card: InventoryCard) => {
    setSelectedCard(card);
    setState('enter-pin');
  };

  const accountBalance = isCardsEnabled ? account?.balance ?? 0 : defaultAccount?.balance ?? 0;
  return (
    <>
      <AnimatePresence>
        {isOpen && state === 'select-card' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Container elevation={4}>
                <Header>
                  <Heading4>{t('Select a card')}</Heading4>
                </Header>

                <Stack direction="row" spacing={1}>
                  {cards.map((card) => (
                    <CardWrapper key={card.number} onClick={() => handleSelectCard(card)}>
                      <BankCard card={card} />
                    </CardWrapper>
                  ))}
                </Stack>

                {error && (
                  <Alert
                    icon={<ErrorRounded />}
                    color="error"
                    sx={{ margin: '0.5rem -1.5rem -1.5rem' }}
                  >
                    {error}
                  </Alert>
                )}
              </Container>
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && state === 'enter-pin' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Container elevation={4}>
                <Header>
                  <Heading4>{selectedCard?.number}</Heading4>
                  <Heading6>{selectedCard?.holder}</Heading6>
                </Header>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <PinField
                      label={t('Enter pin')}
                      value={pin}
                      onChange={(event) => setPin(event.target.value)}
                    />

                    <Button type="submit">{t('Enter pin')}</Button>
                  </Stack>
                </form>

                {error && (
                  <Alert
                    icon={<ErrorRounded />}
                    color="error"
                    sx={{ margin: '0.5rem -1.5rem -1.5rem' }}
                  >
                    {error}
                  </Alert>
                )}
              </Container>
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && state === 'withdraw' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Container elevation={4}>
                <Header>
                  <AccountBalance>{t('Account balance')}</AccountBalance>
                  <Heading2>{formatMoney(accountBalance, config.general)}</Heading2>
                </Header>

                <WithdrawText>{t('Quick withdraw')}</WithdrawText>
                <WithdrawContainer>
                  {withdrawOptions.map((value) => (
                    <Button
                      key={value}
                      onClick={() => handleWithdraw(value)}
                      data-value={value}
                      disabled={value > accountBalance || isLoading}
                    >
                      {formatMoney(value, config.general)}
                    </Button>
                  ))}
                </WithdrawContainer>

                {error && (
                  <Alert icon={<ErrorRounded />} color="error" sx={{ marginTop: '1rem' }}>
                    {error}
                  </Alert>
                )}
              </Container>
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default ATM;

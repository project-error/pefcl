import React, { useState } from 'react';
import Button from '@components/ui/Button';
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Heading1 } from '@components/ui/Typography/Headings';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { useTranslation } from 'react-i18next';
import BaseDialog from '@components/Modals/BaseDialog';
import { fetchNui } from '@utils/fetchNui';
import { CardEvents } from '@typings/Events';
import { CheckRounded, ErrorRounded, InfoRounded } from '@mui/icons-material';
import { BlockCardInput, UpdateCardPinInput } from '@typings/BankCard';
import PinField from '@components/ui/Fields/PinField';

interface CardActionsProps {
  cardId: number;
  onBlock?(): void;
}

const CardActions = ({ cardId, onBlock }: CardActionsProps) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [isBlockingCard, setIsBlockingCard] = useState(false);
  const [pin, setPin] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const { t } = useTranslation();

  const handleClose = () => {
    setIsLoading(false);
    setIsUpdatingPin(false);
    setIsBlockingCard(false);
    setError('');
    setNewPin('');
    setOldPin('');
    setConfirmNewPin('');

    setTimeout(() => {
      setSuccess('');
    }, 2000);
  };

  const handleBlockCard = async () => {
    try {
      setSuccess('');
      setError('');
      setIsLoading(true);

      await fetchNui<unknown, BlockCardInput>(CardEvents.Block, {
        cardId,
        pin: parseInt(pin, 10),
      });
      setSuccess(t('Successfully blocked the card.'));
      handleClose();
      onBlock?.();
    } catch (err: unknown | Error) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }

    setIsLoading(false);
  };

  const handleUpdatePin = async () => {
    try {
      setError('');
      setSuccess('');

      if (confirmNewPin !== newPin) {
        setError(t('Pins do not match'));
        return;
      }

      setIsLoading(true);
      const data = { cardId, newPin: parseInt(newPin, 10), oldPin: parseInt(oldPin, 10) };
      await fetchNui<unknown, UpdateCardPinInput>(CardEvents.UpdatePin, data);

      setSuccess(t('Successfully updated pin.'));
      handleClose();
    } catch (err: unknown | Error) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Stack maxWidth="22rem">
        <Stack spacing={2}>
          <Stack>
            <Heading1>{t('Actions')}</Heading1>
            <PreHeading>{t('Block, update pin and more.')}</PreHeading>
          </Stack>

          <Stack spacing={1} marginTop={2}>
            <Button onClick={() => setIsUpdatingPin(true)}>{t('Update pin')}</Button>
            <Button color="error" onClick={() => setIsBlockingCard(true)}>
              {t('Block the card')}
            </Button>
          </Stack>

          {success && (
            <Alert icon={<CheckRounded />} color="success">
              {success}
            </Alert>
          )}
        </Stack>
      </Stack>

      <BaseDialog open={isUpdatingPin} onClose={handleClose}>
        <DialogTitle>{t('Update pin')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <PinField
                label={t('Old pin')}
                value={oldPin}
                onChange={(event) => setOldPin(event.target.value)}
              />
              <PinField
                label={t('New pin')}
                value={newPin}
                onChange={(event) => setNewPin(event.target.value)}
              />
              <PinField
                value={confirmNewPin}
                label={t('Confirm new pin')}
                onChange={(event) => setConfirmNewPin(event.target.value)}
              />
            </Stack>

            {(Boolean(error) || isLoading) && (
              <Alert
                icon={isLoading ? <InfoRounded /> : <ErrorRounded />}
                color={isLoading ? 'info' : 'error'}
              >
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleUpdatePin} disabled={isLoading}>
            {t('Update pin')}
          </Button>
        </DialogActions>
      </BaseDialog>

      <BaseDialog open={isBlockingCard} onClose={handleClose}>
        <DialogTitle>{t('Blocking card')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <DialogContentText>
                {t('Are you sure you want to block this card? This action cannot be undone.')}
              </DialogContentText>
              <Typography variant="caption">{t('Enter card pin to block the card.')}</Typography>
              <PinField
                label={t('Enter pin')}
                value={pin}
                onChange={(event) => setPin(event.target.value)}
              />
            </Stack>

            {error && (
              <Alert
                icon={isLoading ? <InfoRounded /> : <ErrorRounded />}
                color={isLoading ? 'info' : 'error'}
              >
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button color="error" onClick={handleBlockCard} disabled={isLoading}>
            {t('Block the card')}
          </Button>
        </DialogActions>
      </BaseDialog>
    </>
  );
};

export default CardActions;

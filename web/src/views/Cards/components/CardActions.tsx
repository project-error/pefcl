import React, { useState } from 'react';
import Button from '@components/ui/Button';
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Heading1 } from '@components/ui/Typography/Headings';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { useTranslation } from 'react-i18next';
import BaseDialog from '@components/Modals/BaseDialog';
import { fetchNui } from '@utils/fetchNui';
import { CardEvents } from '@typings/Events';
import { CheckRounded, ErrorRounded, InfoRounded } from '@mui/icons-material';
import { BlockCardInput, DeleteCardInput, UpdateCardPinInput } from '@typings/BankCard';
import PinField from '@components/ui/Fields/PinField';

interface CardActionsProps {
  cardId: number;
  isBlocked?: boolean;
  onBlock?(): void;
  onDelete?(): void;
}

const CardActions = ({ cardId, onBlock, onDelete, isBlocked }: CardActionsProps) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<'none' | 'block' | 'update' | 'delete'>('none');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const { t } = useTranslation();

  const handleClose = () => {
    setIsLoading(false);
    setDialog('none');
    setError('');
    setNewPin('');
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

  const handleDeleteCard = async () => {
    try {
      setSuccess('');
      setError('');
      setIsLoading(true);

      await fetchNui<unknown, DeleteCardInput>(CardEvents.Delete, {
        cardId,
      });
      setSuccess(t('Successfully deleted the card.'));
      handleClose();
      onDelete?.();
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
      const data = { cardId, newPin: parseInt(newPin, 10) };
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
            <Button onClick={() => setDialog('update')}>{t('Update pin')}</Button>
            <Button color="error" onClick={() => setDialog('block')}>
              {t('Block the card')}
            </Button>

            <Button
              color="error"
              onClick={() => !isBlocked && setDialog('delete')}
              disabled={isLoading || !isBlocked}
            >
              {t('Delete the card')}
            </Button>
          </Stack>

          {success && (
            <Alert icon={<CheckRounded />} color="success">
              {success}
            </Alert>
          )}
        </Stack>
      </Stack>

      <BaseDialog open={dialog === 'update'} onClose={handleClose}>
        <DialogTitle>{t('Update pin')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Stack spacing={1}>
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

      <BaseDialog open={dialog === 'block'} onClose={handleClose}>
        <DialogTitle>{t('Blocking card')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <DialogContentText>
                {t('Are you sure you want to block this card? This action cannot be undone.')}
              </DialogContentText>
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

      <BaseDialog open={dialog === 'delete'} onClose={handleClose}>
        <DialogTitle>{t('Deleting card')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <DialogContentText>
                {t('Are you sure you want to delete this card? This action cannot be undone.')}
              </DialogContentText>
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
          <Button color="error" onClick={handleDeleteCard} disabled={isLoading}>
            {t('Delete the card')}
          </Button>
        </DialogActions>
      </BaseDialog>
    </>
  );
};

export default CardActions;

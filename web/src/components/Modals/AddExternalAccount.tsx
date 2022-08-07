import Button from '@components/ui/Button';
import TextField from '@components/ui/Fields/TextField';
import { Box, DialogContent, DialogTitle, FormHelperText, Stack } from '@mui/material';
import { ExternalAccountEvents } from '@typings/Events';
import { AccountErrors, ExternalAccountErrors, GenericErrors } from '@typings/Errors';
import { fetchNui } from '@utils/fetchNui';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { externalAccountsAtom } from '@data/externalAccounts';
import { regexExternalNumber } from '@shared/utils/regexes';
import BaseDialog from './BaseDialog';

interface FormValues {
  name: string;
  number: string;
}
interface AddExternalAccountModalProps {
  isOpen: boolean;
  onClose(): void;
}
const AddExternalAccountModal = ({ isOpen, onClose }: AddExternalAccountModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [, updateExternalAccounts] = useAtom(externalAccountsAtom);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      number: '',
      name: '',
    },
  });

  const handleClose = () => {
    onClose();
    setError('');
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError('');

    try {
      await fetchNui(ExternalAccountEvents.Add, values);
      updateExternalAccounts();
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
      if (!(error instanceof Error)) {
        return;
      }

      if (error.message === AccountErrors.AlreadyExists) {
        setError(t('An account for the specified number already exists'));
        return;
      }

      if (error.message === GenericErrors.NotFound) {
        setError(t('The specified number does not match an existing account'));
        return;
      }

      if (error.message === ExternalAccountErrors.AccountIsYours) {
        setError(t('You already have access to this account. Use internal transfer instead'));
        return;
      }

      setError(t('Something went wrong, please try again later.'));
    }
  };

  return (
    <BaseDialog open={isOpen} onClose={handleClose} maxWidth="xs">
      <Box p={2}>
        <DialogTitle>
          <span>{t('Add external account')}</span>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Controller
                  name="number"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('Clearing- & account number is required'),
                    },
                    pattern: {
                      value: regexExternalNumber,
                      message: t('Invalid number, format is: xxx, xxxx-xxxx-xxxx'),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      label={t('Clearing- & account number')}
                      placeholder={'xxx, xxxx-xxxx-xxxx'} // TODO: Generate from numberformatting func
                      {...field}
                      ref={null}
                    />
                  )}
                />

                <FormHelperText>{formState.errors.number?.message}</FormHelperText>
              </Stack>

              <Stack spacing={1}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('Account name is required'),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      placeholder={t('Account name')}
                      label={t('External account name')}
                      {...field}
                      ref={null}
                    />
                  )}
                />

                <FormHelperText>{formState.errors.name?.message}</FormHelperText>
              </Stack>
            </Stack>

            <FormHelperText>{error}</FormHelperText>
          </DialogContent>

          <Box p="0.5rem 1.5rem 1.5rem">
            <Stack justifyContent="flex-end" spacing={1}>
              <Button type="submit" disabled={isLoading}>
                {t('Add external account')}
              </Button>
              <Button color="error" onClick={handleClose} disabled={isLoading}>
                {t('Cancel')}
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </BaseDialog>
  );
};

export default AddExternalAccountModal;

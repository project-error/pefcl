import { Box, FormControlLabel, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AccountEvents } from '@typings/Account';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import { fetchNui } from '../../utils/fetchNui';
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import TextField from '../ui/Fields/TextField';
import { Heading2, Heading6 } from '../ui/Typography/Headings';

interface CreateAccountForm {
  accountName: string;
  isDefault: boolean;
  isShared: boolean;
  fromAccountId: number;
}

const CreateAccountModal: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [accounts, refetchAccounts] = useAtom(accountsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const { control, handleSubmit, watch } = useForm<CreateAccountForm>({
    defaultValues: {
      fromAccountId: defaultAccount?.id ?? 0,
    },
  });

  const watchedAccountId = watch('fromAccountId');
  const selectedAccount = accounts.find((account) => account.id === watchedAccountId);

  const isFirstSetup = accounts.length === 0;
  const isDisabled = (selectedAccount?.balance ?? 0) < config?.prices?.newAccount && !isFirstSetup;

  const onSubmit = (values: CreateAccountForm) => {
    fetchNui(AccountEvents.CreateAccount, values).then(refetchAccounts).finally(onClose);
  };

  return (
    <Box p={5} display="flex" flexDirection="column">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={8}>
          <Stack spacing={4} flex={1}>
            <Heading2>{t('Open account')}</Heading2>

            <Stack spacing={2}>
              <Controller
                name="accountName"
                control={control}
                render={({ field }) => (
                  <TextField
                    placeholder={t('Account name')}
                    label={t('Account name')}
                    {...field}
                    ref={null}
                  />
                )}
              />

              <div>
                <Controller
                  name="isDefault"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} ref={null} />}
                      label={<Heading6>{t('This should be the default account')}</Heading6>}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="isShared"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} ref={null} />}
                      label={<Heading6>{t('This is a shared account')}</Heading6>}
                    />
                  )}
                />
              </div>
            </Stack>
          </Stack>

          <Stack flex={1} spacing={4}>
            <Controller
              name="fromAccountId"
              control={control}
              render={({ field }) => (
                <AccountSelect accounts={accounts} onSelect={field.onChange} />
              )}
            />

            <Summary balance={selectedAccount?.balance ?? 0} payment={config.prices.newAccount} />

            <Stack direction="row" spacing={4} alignSelf="flex-end">
              <Button color="error" onClick={onClose}>
                {t('Cancel')}
              </Button>
              <Button disabled={isDisabled} type="submit">
                {t('CREATE')}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateAccountModal;

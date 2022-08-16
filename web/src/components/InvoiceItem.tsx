import React, { useState } from 'react';

import { Stack } from '@mui/material';
import styled from '@emotion/styled';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Heading6 } from './ui/Typography/Headings';
import theme from '@utils/theme';
import { Invoice, InvoiceStatus } from '@typings/Invoice';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@hooks/useConfig';
import PayInvoiceModal from './Modals/PayInvoice';
import { BodyText } from './ui/Typography/BodyText';
import { formatMoney } from '@utils/currency';
import Button from './ui/Button';
import Status from './ui/Status';
import BaseDialog from './Modals/BaseDialog';

dayjs.extend(calendar);
dayjs.extend(relative);

const ExpireDate = styled(Heading6)`
  font-weight: ${theme.typography.fontWeightLight};
`;

const From = styled(BodyText)`
  font-weight: ${theme.typography.fontWeightBold};
  white-space: pre;
  text-overflow: ellipsis;
  max-width: 14rem;
  overflow: hidden;
`;

const Message = styled(BodyText)`
  color: ${theme.palette.text.secondary};
`;

const ExpiresAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing(1.5)} 0;
  border-bottom: 1px solid ${theme.palette.background.light8};
`;

const PaidStatusContainer = styled(ExpiresAndButton)`
  justify-content: flex-end;
`;

const InvoiceItem: React.FC<{ invoice: Invoice }> = ({ invoice, ...props }) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, expiresAt, from } = invoice;
  const config = useConfig();
  const expiresDate = dayjs(expiresAt);
  const createdDate = dayjs(createdAt);
  const [isPayOpen, setIsPayOpen] = useState(false);

  const handleCloseModal = () => {
    setIsPayOpen(false);
  };

  return (
    <div {...props} key={id}>
      <BaseDialog open={isPayOpen} onClose={handleCloseModal} maxWidth="md">
        <PayInvoiceModal onClose={handleCloseModal} invoice={invoice} />
      </BaseDialog>

      <Stack spacing={0}>
        <Stack flexDirection="row" justifyContent="space-between">
          <From>{from}</From>
          <BodyText>{formatMoney(amount, config.general)}</BodyText>
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between">
          <Message>{message}</Message>
          <ExpireDate>{createdDate.fromNow()}</ExpireDate>
        </Stack>

        {invoice.status === InvoiceStatus.PENDING && (
          <ExpiresAndButton>
            <Stack>
              <Heading6>{t('Expires')}</Heading6>
              <ExpireDate>{expiresDate.format(t('DATE_FORMAT'))}</ExpireDate>
            </Stack>

            <Button onClick={() => setIsPayOpen(true)}>{t('Pay invoice')}</Button>
          </ExpiresAndButton>
        )}

        {invoice.status === InvoiceStatus.PAID && (
          <PaidStatusContainer>
            <Status label={t('Paid')} color="success" />
          </PaidStatusContainer>
        )}
      </Stack>
    </div>
  );
};

export default InvoiceItem;

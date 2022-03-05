import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import React from 'react';
import { BodyText } from '../../../components/ui/Typography/BodyText';
import { Heading6 } from '../../../components/ui/Typography/Headings';
import { useConfig } from '../../../hooks/useConfig';
import { formatMoney } from '../../../utils/currency';
import theme from '../../../utils/theme';
import { pendingInvoicesAtom } from '../../../data/invoices';
import { Invoice } from '../../../../../typings/Invoice';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';

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

const InvoiceItem: React.FC<Invoice> = ({
  message,
  amount,
  id,
  createdAt,
  expiresAt,
  from,
  ...props
}) => {
  const { t } = useTranslation();
  const config = useConfig();
  const expiresDate = dayjs.unix(parseInt(expiresAt, 10));
  const createdDate = dayjs.unix(parseInt(createdAt, 10));

  return (
    <div {...props} key={id}>
      <Stack spacing={0}>
        <Stack flexDirection="row" justifyContent="space-between">
          <From>{from}</From>
          <BodyText>{formatMoney(amount, config)}</BodyText>
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between">
          <Message>{message}</Message>
          <ExpireDate>{createdDate.fromNow()}</ExpireDate>
        </Stack>

        <ExpiresAndButton>
          <Stack>
            <Heading6>{t('Expires')}</Heading6>
            <ExpireDate>{expiresDate.calendar()}</ExpireDate>
          </Stack>
          <Button>{t('Pay invoice')}</Button>
        </ExpiresAndButton>
      </Stack>
    </div>
  );
};

const PendingInvoices: React.FC = () => {
  const [invoices] = useAtom(pendingInvoicesAtom);

  return (
    <Stack spacing={2}>
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} {...invoice} />
      ))}
    </Stack>
  );
};

export default PendingInvoices;

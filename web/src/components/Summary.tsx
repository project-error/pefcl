import styled from '@emotion/styled';
import { Divider } from '@mui/material';
import { fontWeight } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import { BodyText } from './ui/Typography/BodyText';
import { Heading6 } from './ui/Typography/Headings';

const Row = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
`;

const Label = styled(BodyText)``;
const Amount = styled(BodyText)`
  ${fontWeight}
`;

interface SummaryRowProps {
  label: string;
  amount: number;
}
const SummaryRow: React.FC<SummaryRowProps> = ({ label, amount }) => {
  const config = useConfig();
  return (
    <Row>
      <Label>{label}</Label>
      <Amount>{formatMoney(amount, config.general)}</Amount>
    </Row>
  );
};

interface SummaryProps {
  balance: number;
  payment: number;
}

const Summary: React.FC<SummaryProps> = ({ balance, payment }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Heading6>{t('Summary')}</Heading6>
      <SummaryRow label={t('Balance')} amount={balance}></SummaryRow>
      <SummaryRow label={t('Cost')} amount={-payment}></SummaryRow>
      <Divider sx={{ m: '0.5rem 0' }} />
      <SummaryRow label={t('New balance')} amount={balance - payment}></SummaryRow>
    </div>
  );
};

export default Summary;

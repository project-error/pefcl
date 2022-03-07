import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import { Heading5 } from '../../../components/ui/Typography/Headings';
import theme from '../../../utils/theme';

const Container = styled.div`
  padding: ${theme.spacing(3)};
  border-radius: ${theme.spacing(2)};
  background-color: ${theme.palette.background.paper};
`;

const Total = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  height: 2rem;
  padding: 0 0.73rem;

  border-radius: ${theme.spacing(1)};
  font-weight: ${theme.typography.fontWeightBold};
  background-color: ${theme.palette.background.light4};
`;

const Content = styled.div`
  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    background-color: ${theme.palette.background.dark4};
    border-radius: 2rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2rem;
    background-color: #80cae24a;
  }

  padding-right: 12px;
  max-height: 16rem;
  overflow: auto;
`;

interface DashboardContainerProps {
  title: string;
  total: number;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children, total, title }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Heading5>{title}</Heading5>
          <Total>{total}</Total>
        </Stack>

        <Content>{children}</Content>

        <Stack justifyContent="flex-end" alignItems="flex-end">
          <Button>{t('View all')}</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default DashboardContainer;

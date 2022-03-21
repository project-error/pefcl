import styled from '@emotion/styled';
import { CircularProgress, Stack } from '@mui/material';
import { Atom, useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Button from '@ui/Button';
import { Heading5 } from '@ui/Typography/Headings';
import theme from '../../../utils/theme';

const Container = styled.div`
  padding: ${theme.spacing(3)};
  border-radius: ${theme.spacing(2)};
  background-color: ${theme.palette.background.paper};
`;

const LoadingContainer = styled(Container)``;

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

const Title = styled(Heading5)`
  color: ${theme.palette.primary.dark};
`;

interface DashboardContainerProps {
  title: string;
  totalAtom: Atom<number>;
  viewAllRoute: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  title,
  children,
  totalAtom,
  viewAllRoute,
}) => {
  const [total] = useAtom(totalAtom);
  const { t } = useTranslation();
  const { push } = useHistory();

  return (
    <Container>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Title>{title}</Title>
          <Total>{total}</Total>
        </Stack>

        <Content>{children}</Content>

        <Stack justifyContent="flex-end" alignItems="flex-end">
          <Button onClick={() => push(viewAllRoute)}>{t('View all')}</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export const DashboardContainerFallback: React.FC<{ title: string }> = ({ title }) => {
  return (
    <LoadingContainer>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Heading5>{title}</Heading5>
        <Total>0</Total>
      </Stack>

      <Stack p={8} alignItems="center">
        <CircularProgress />
      </Stack>
    </LoadingContainer>
  );
};

export default DashboardContainer;

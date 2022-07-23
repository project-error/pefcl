import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Divider, Popover, Stack } from '@mui/material';
import { red } from '@mui/material/colors';
import { Box } from '@mui/system';
import { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import theme from '@utils/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Count from './ui/Count';
import { Heading6 } from './ui/Typography/Headings';

const Container = styled.div``;
const Col = styled.div<{ height?: number }>`
  width: 3px;
  height: 4rem;
  border-radius: 1px;
  background-color: ${theme.palette.primary.main};

  height: ${({ height }) => `${height}rem`};
`;

const Expense = styled(Col)`
  background-color: ${red[400]};
`;

const IncomeText = styled(Heading6)`
  color: ${theme.palette.primary.main};
`;
const ExpenseText = styled(Heading6)`
  color: ${red[400]};
`;

interface ColumnProps {
  date: Date;
  income: number;
  expenses: number;
  maxHeight: number;
}

const Column = ({ date, income, expenses, maxHeight }: ColumnProps) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <span style={{ position: 'relative' }}>
        <Popover
          aria-owns={isOpen ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onClose={handlePopoverClose}
          open={isOpen}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          <Box p={2}>
            <Stack spacing={1}>
              <Stack spacing={0.5}>
                <Heading6>{t('Income')}</Heading6>
                <IncomeText>{formatMoney(income, config.general)}</IncomeText>
              </Stack>
              <Divider />
              <Stack spacing={0.5}>
                <Heading6>{t('Expense')}</Heading6>
                <ExpenseText>{formatMoney(expenses, config.general)}</ExpenseText>
              </Stack>
            </Stack>
          </Box>
        </Popover>
      </span>

      <Stack
        alignItems="center"
        spacing={1}
        justifyContent="flex-end"
        onMouseEnter={handlePopoverOpen}
        onClick={handlePopoverOpen}
      >
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <Expense height={Math.abs(expenses) / maxHeight} />
          <Col height={income / maxHeight} />
        </Stack>
        <Count amount={Number(date.getDate())} />
      </Stack>
    </>
  );
};

interface WeekGraphProps {
  data: GetTransactionHistoryResponse['lastWeek'];
}

const WeekGraph = ({ data }: WeekGraphProps) => {
  const incomeMax = Object.values(data).reduce((val, curr) => val + curr.income, 0);
  const expenseMax = Object.values(data).reduce((val, curr) => val + curr.expenses, 0);

  const maxHeight = Math.max(incomeMax, Math.abs(expenseMax)) / 5;

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {Object.entries(data).map(([key, value]) => (
          <Column key={key} {...value} maxHeight={maxHeight} date={new Date(key)} />
        ))}
      </Stack>
    </Container>
  );
};

export default WeekGraph;

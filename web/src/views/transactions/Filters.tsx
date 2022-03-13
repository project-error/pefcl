import { Chip, Stack } from '@mui/material';
import { Transaction, TransactionType } from '@typings/transactions';
import React, { useEffect, useState } from 'react';

const filters: Record<string, CallableFunction> = {
  [TransactionType.Incoming]: (transaction: Transaction) =>
    transaction.type === TransactionType.Incoming,
  [TransactionType.Outgoing]: (transaction: Transaction) =>
    transaction.type === TransactionType.Outgoing,
  [TransactionType.Transfer]: (transaction: Transaction) =>
    transaction.type === TransactionType.Transfer,
};

interface TransactionFiltersProps {
  updateActiveFilters(filters: CallableFunction[]): void;
}
const TransactionFilters: React.FC<TransactionFiltersProps> = ({ updateActiveFilters }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleChipClick = (key: string) => {
    const isActive = activeFilters.includes(key);

    if (isActive) {
      setActiveFilters((prev) => prev.filter((filter) => filter !== key));
    } else {
      setActiveFilters((prev) => [...prev, key]);
    }
  };

  useEffect(() => {
    updateActiveFilters(activeFilters.map((key) => filters[key]));
  }, [activeFilters, updateActiveFilters]);

  return (
    <Stack direction="row" spacing={1}>
      {Object.keys(filters).map((key) => (
        <Chip
          label={key}
          key={key}
          clickable
          onClick={() => handleChipClick(key)}
          color={activeFilters.includes(key) ? 'primary' : 'default'}
        />
      ))}
    </Stack>
  );
};

export default TransactionFilters;

import { Chip, Stack } from '@mui/material';
import { Transaction, TransactionType } from '@typings/transactions';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslateFunction } from 'src/translation/i18n';

export interface TransactionFilter {
  label: ReturnType<TranslateFunction>;
  sort(transaction: Transaction): boolean;
}

const getFilters = (t: TranslateFunction): Record<string, TransactionFilter> => ({
  [TransactionType.Incoming]: {
    label: t('TransactionType.Incoming'),
    sort: (transaction: Transaction) => transaction.type === TransactionType.Incoming,
  },
  [TransactionType.Outgoing]: {
    label: t('TransactionType.Outgoing'),
    sort: (transaction: Transaction) => transaction.type === TransactionType.Outgoing,
  },
  [TransactionType.Transfer]: {
    label: t('TransactionType.Transfer'),
    sort: (transaction: Transaction) => transaction.type === TransactionType.Transfer,
  },
});

interface TransactionFiltersProps {
  updateActiveFilters(filters: TransactionFilter[]): void;
}
const TransactionFilters: React.FC<TransactionFiltersProps> = ({ updateActiveFilters }) => {
  const { t } = useTranslation();
  const filters = getFilters(t);
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
    const updateFilters: TransactionFilter[] = activeFilters.map((key) => filters[key]);

    updateActiveFilters(updateFilters);
  }, [activeFilters, updateActiveFilters, filters]);

  return (
    <Stack direction="row" spacing={1}>
      {Object.entries(filters).map(([key, filter]) => (
        <Chip
          label={filter.label}
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

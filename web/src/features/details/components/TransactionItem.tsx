import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';
import { Transaction } from '../../../../../typings/transactions';
import dayjs from 'dayjs';

const TransactionItem: React.FC<Transaction> = (transaction) => (
  <ListItem divider>
    <ListItemText>
      <Typography color="text.primary" style={{ minWidth: 150 }}>
        {transaction.target}
      </Typography>
    </ListItemText>
    <ListItemText>
      <Typography color="text.primary" style={{ minWidth: 150 }}>
        {dayjs.unix(parseInt(transaction.date, 10)).format('MM/DD/YYYY')}
      </Typography>
    </ListItemText>
    <Typography color="text.primary">${transaction.amount}</Typography>
  </ListItem>
);

export default TransactionItem;

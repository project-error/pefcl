import { sequelize } from '../db/pool';
import { config } from '../server-config';
import { AccountModel } from './account/account.model';
import { TransactionModel } from './transaction/transaction.model';
import './invoice/invoice.model';

TransactionModel.belongsTo(AccountModel, {
  as: 'toAccount',
});

TransactionModel.belongsTo(AccountModel, {
  as: 'fromAccount',
});

if (config.database.shouldSync) {
  sequelize.sync();
}

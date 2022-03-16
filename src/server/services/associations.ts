import { sequelize } from '../db/pool';
import { config } from '@utils/server-config';
import { AccountModel } from './account/account.model';
import { TransactionModel } from './transaction/transaction.model';
import './invoice/invoice.model';
import { SharedAccountModel } from './account/sharedAccount.model';

TransactionModel.belongsTo(AccountModel, {
  as: 'toAccount',
});

TransactionModel.belongsTo(AccountModel, {
  as: 'fromAccount',
});

SharedAccountModel.belongsTo(AccountModel, {
  as: 'account',
});

if (config.database.shouldSync) {
  sequelize.sync();
}

import { sequelize } from '../utils/pool';
import { config } from '@utils/server-config';
import { AccountModel } from './account/account.model';
import { TransactionModel } from './transaction/transaction.model';
import './invoice/invoice.model';
import { SharedAccountModel } from './accountShared/sharedAccount.model';

/* This is so annoying. Next time choose something with TS support. */
declare module './accountShared/sharedAccount.model' {
  interface SharedAccountModel {
    setAccount(id: number): Promise<void>;
  }
}

declare module './transaction/transaction.model' {
  interface TransactionModel {
    setFromAccount(id?: number): Promise<void>;
    setToAccount(id?: number): Promise<void>;
  }
}

TransactionModel.belongsTo(AccountModel, {
  as: 'toAccount',
});

TransactionModel.belongsTo(AccountModel, {
  as: 'fromAccount',
});

SharedAccountModel.belongsTo(AccountModel, {
  as: 'account',
});

if (config?.database?.shouldSync) {
  sequelize.sync();
}

import { sequelize } from '../db/pool';
import { UserModule } from '../user/user.module';
import { AccountModel } from './account/account.model';
import { TransactionModel } from './transaction/transaction.model';

TransactionModel.belongsTo(AccountModel, {
  as: 'toAccount',
});

TransactionModel.belongsTo(AccountModel, {
  as: 'fromAccount',
});

// AccountModel.hasMany(TransactionModel);

sequelize.sync();

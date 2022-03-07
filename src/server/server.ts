import './globals.server';

import { ServerPromiseResp } from '@project-error/pe-utils';
import 'reflect-metadata';
import './server-config';
import './db/pool';
import './user/user.controller';
import './services/account/account.controller';
import './services/transaction/transaction.controller';
import { Bank } from './base/Bank';
import {
  AccountEvents,
  AccountType,
  DepositDTO,
  PreDBAccount,
  TransactionEvents,
} from '../../typings/accounts';
import { sequelize as sequelize } from './db/pool';
import express, { RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

/* Create associations after the models etc */
import './services/associations';

new Bank().bootstrap();

const isDevelopment = process.env.NODE_ENV === 'development';

const createEndpoint = (eventName: string): [string, RequestHandler] => {
  const endpoint = `/${eventName.replace(':', '-')}`;
  const responseEventName = `${eventName}-response`;

  return [
    endpoint,
    async (req, res) => {
      console.log('retrieved:', req);
      emitNet(eventName, responseEventName, req.body);
      const result = await new Promise((resolve) => {
        onNet(responseEventName, (_source: number, data: ServerPromiseResp<unknown>) => {
          resolve(data.data);
        });
      });

      return res.send(result);
    },
  ];
};

if (isDevelopment) {
  const app = express();
  const port = 3005;
  app.use(cors());
  app.use(bodyParser.json());

  app.post('/', (_req, res) => {
    res.send('This is a mocked version of the Fivem Server. Available endpoints are unknown :p');
  });

  app.post(...createEndpoint(AccountEvents.GetAccounts));
  app.post(...createEndpoint(AccountEvents.SetDefaultAccount));
  app.post(...createEndpoint(TransactionEvents.Get));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

const test = async () => {
  await sequelize.authenticate();
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });

  global.source = 2;
  emit('playerJoining', {});

  /* Emit something */
  // const createAccountPayload: PreDBAccount = {
  //   accountName: 'Bennys AB',
  //   type: AccountType.Shared,
  // };

  // emitNet(AccountEvents.CreateAccount, AccountEvents.CreateAccountResponse, createAccountPayload);

  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  const payload: DepositDTO = {
    amount: 800,
    message: 'ATM Deposition',
    accountId: 10,
  };

  emitNet(AccountEvents.DepositMoney, AccountEvents.CreateAccountResponse, payload);

  //   //   const tgtAccount = req.data.tgtAccount;
  //   //   const depositAmount = req.data.amount;
  //   //   const currentBalance = this._userService.getUser(req.source).getBalance();

  //   emitNet(AccountEvents.DepositMoney, AccountEvents.CreateAccountResponse, {
  //     tgtAccount: {
  //       isDefault: true,
  //     },
  //     amount: 800,
  //   });

  // const accounts = await AccountModel.findAll();
  // const transaction = await TransactionModel.create(
  //   { amount: 2800, message: 'Repairs' },
  //   { include: { all: true } },
  // );

  // console.log({ transaction, accounts });
};

test();

import './globals.server';

import { ServerPromiseResp } from '@project-error/pe-utils';
import 'reflect-metadata';
import './server-config';
import './db/pool';
import './services/controllers';

import { Bank } from './base/Bank';
import { AccountEvents, InvoiceEvents, TransactionEvents } from '../../typings/accounts';
import express, { RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

/* Create associations after the models etc */
import './services/associations';

new Bank().bootstrap();

const isMocking = process.env.NODE_ENV === 'mocking';
type BaseData = {
  data: unknown;
};

const createEndpoint = (eventName: string): [string, RequestHandler] => {
  const endpoint = `/${eventName.replace(':', '-')}`;
  const responseEventName = `${eventName}-response`;

  return [
    endpoint,
    async (req, res) => {
      emitNet(eventName, responseEventName, req.body);
      const result = await new Promise((resolve) => {
        onNet(responseEventName, (_source: number, data: ServerPromiseResp<BaseData>) => {
          resolve(data);
        });
      });

      return res.send(result);
    },
  ];
};

if (isMocking) {
  const app = express();
  const port = 3005;
  app.use(cors());
  app.use(bodyParser.json());

  app.post('/', (_req, res) => {
    res.send('This is a mocked version of the Fivem Server. Available endpoints are unknown :p');
  });

  app.post(...createEndpoint(AccountEvents.GetAccounts));
  app.post(...createEndpoint(AccountEvents.DeleteAccount));
  app.post(...createEndpoint(AccountEvents.SetDefaultAccount));
  app.post(...createEndpoint(AccountEvents.CreateAccount));
  app.post(...createEndpoint(TransactionEvents.Get));
  app.post(...createEndpoint(TransactionEvents.CreateTransfer));
  app.post(...createEndpoint(InvoiceEvents.Get));
  app.post(...createEndpoint(InvoiceEvents.CreateInvoice));
  app.post(...createEndpoint(InvoiceEvents.PayInvoice));

  app.listen(port, () => {
    console.log(`[MOCKSERVER]: listening on port: ${port}`);
  });
}

const test = async () => {
  emit('onServerResourceStart', 'pe-financial');

  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  global.source = 2;
  // emit('playerJoining', {});

  /* */
  /* */
  /** DEBUGGING STUFF */
  /* */
  /* */

  emitNet(AccountEvents.WithdrawMoney, 'returnEvent', {
    amount: 2000,
    message: 'ATM Withdrawal',
  });

  // emitNet(AccountEvents.DepositMoney, 'returnEvent', {
  //   amount: 2000,
  //   message: 'ATM Deposition',
  // });

  // const payload: InvoiceInput = {
  //   to: 'license:1',
  //   from: 'Karl-Jan',
  //   message: 'I need the money',
  //   amount: 500,
  // };

  // emitNet(InvoiceEvents.CreateInvoice, AccountEvents.CreateAccountResponse, payload);

  /* Emit something */
  // const createAccountPayload1: PreDBAccount = {
  //   accountName: 'Bennys AB',
  //   isShared: true,
  //   fromAccountId: 0,
  // };

  // emitNet(AccountEvents.CreateAccount, AccountEvents.CreateAccountResponse, createAccountPayload1);
  // const createAccountPayload2: PreDBAccount = {
  //   accountName: 'Pension',
  //   isDefault: false,
  //   fromAccountId: 0,
  // };

  // emitNet(AccountEvents.CreateAccount, AccountEvents.CreateAccountResponse, createAccountPayload2);

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 800);
  // });

  // const payload: DepositDTO = {
  //   amount: 800,
  //   message: 'ATM Deposition',
  //   accountId: 1,
  // };

  // emitNet(AccountEvents.DepositMoney, AccountEvents.CreateAccountResponse, payload);

  // const transaction: Transfer = {
  //   amount: 25000,
  //   message: 'Internal transfer',
  //   toAccountId: 1,
  //   fromAccountId: 2,
  // };
  // emitNet(TransactionEvents.CreateTransfer, AccountEvents.CreateAccountResponse, transaction);
};

test();

import { ClientUtils } from '@project-error/pe-utils';
import { ATMInput } from '@typings/Account';
import { AccountEvents, CashEvents, InvoiceEvents } from '@typings/Events';
import { ServerPromiseResp } from '@typings/http';
import { Invoice, InvoiceOnlineInput } from '@typings/Invoice';

export class Api {
  utils: ClientUtils;

  constructor() {
    this.utils = new ClientUtils({ promiseTimout: 200 });
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      const serverRes = await this.utils.emitNetPromise<ServerPromiseResp<Invoice[]>>(
        InvoiceEvents.Get,
        {},
      );

      if (serverRes.status !== 'ok') {
        throw new Error(serverRes.errorMsg);
      }

      return serverRes.data ?? [];
    } catch (e) {
      console.error(e);
    }

    return [];
  }

  async giveCash(source: number, amount: number): Promise<boolean> {
    const serverRes = await this.utils.emitNetPromise<ServerPromiseResp<boolean>>(CashEvents.Give, {
      source,
      amount,
    });

    if (serverRes.status !== 'ok') {
      throw new Error(serverRes.errorMsg);
    }

    return serverRes.data ?? false;
  }

  async getMyCash(): Promise<number | undefined> {
    try {
      const serverRes = await this.utils.emitNetPromise<ServerPromiseResp<number>>(
        CashEvents.GetMyCash,
        {},
      );

      if (serverRes.status !== 'ok') {
        throw new Error(serverRes.errorMsg);
      }

      return serverRes.data;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async createInvoice(data: InvoiceOnlineInput): Promise<Invoice | undefined> {
    try {
      const serverRes = await this.utils.emitNetPromise<ServerPromiseResp<Invoice>>(
        InvoiceEvents.CreateOnlineInvoice,
        data,
      );

      if (serverRes.status !== 'ok') {
        throw new Error(serverRes.errorMsg);
      }

      return serverRes.data;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async depositMoney(amount: number) {
    try {
      const payload: ATMInput = {
        amount,
        message: 'Deposition',
      };
      const response = await this.utils.emitNetPromise(AccountEvents.DepositMoney, payload);
      console.log({ response });
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async withdrawMoney(amount: number) {
    try {
      const payload: ATMInput = {
        amount,
        message: 'Withdrawal',
      };

      const response = await this.utils.emitNetPromise(AccountEvents.WithdrawMoney, payload);
      console.log({ response });
    } catch (e) {
      console.error(e);
      return;
    }
  }
}

export default new Api();

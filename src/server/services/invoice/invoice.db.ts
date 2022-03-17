import { singleton } from 'tsyringe';
import { InvoiceInput, InvoiceStatus } from '@typings/Invoice';
import { InvoiceModel } from './invoice.model';

const twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2;

@singleton()
export class InvoiceDB {
  async getAllInvoices(): Promise<InvoiceModel[]> {
    return await InvoiceModel.findAll();
  }

  async getAllReceivingInvoices(identifier: string): Promise<InvoiceModel[]> {
    return await InvoiceModel.findAll({ where: { to: identifier } });
  }

  async getInvoiceById(id: number): Promise<InvoiceModel> {
    return await InvoiceModel.findOne({ where: { id } });
  }

  async createInvoice(input: InvoiceInput): Promise<InvoiceModel> {
    const expiresAt = input.expiresAt
      ? input.expiresAt
      : new Date(Date.now() + twoWeeks).toString();

    return await InvoiceModel.create({ ...input, expiresAt });
  }

  async payInvoice(invoiceId: number): Promise<number> {
    const [result] = await InvoiceModel.update(
      { status: InvoiceStatus.PAID },
      { where: { id: invoiceId } },
    );
    return result;
  }
}

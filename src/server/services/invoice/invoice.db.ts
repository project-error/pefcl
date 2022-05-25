import { singleton } from 'tsyringe';
import { CreateInvoiceInput, InvoiceStatus } from '@typings/Invoice';
import { InvoiceModel } from './invoice.model';
import { MS_TWO_WEEKS } from '@utils/constants';

@singleton()
export class InvoiceDB {
  async getAllInvoices(): Promise<InvoiceModel[]> {
    return await InvoiceModel.findAll();
  }

  async getAllReceivingInvoices(identifier: string): Promise<InvoiceModel[]> {
    return await InvoiceModel.findAll({ where: { toIdentifier: identifier } });
  }

  async getInvoiceById(id: number): Promise<InvoiceModel | null> {
    return await InvoiceModel.findOne({ where: { id } });
  }

  async createInvoice(input: CreateInvoiceInput): Promise<InvoiceModel> {
    const expiresAt = input.expiresAt
      ? input.expiresAt
      : new Date(Date.now() + MS_TWO_WEEKS).toString();

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

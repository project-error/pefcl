import { singleton } from 'tsyringe';
import { CreateInvoiceInput, GetInvoicesInput, InvoiceStatus } from '@typings/Invoice';
import { InvoiceModel } from './invoice.model';
import { MS_TWO_WEEKS } from '@utils/constants';
import { Transaction } from 'sequelize/types';

@singleton()
export class InvoiceDB {
  async getAllInvoices(): Promise<InvoiceModel[]> {
    return await InvoiceModel.findAll();
  }

  async getAllReceivingInvoices(
    identifier: string,
    pagination: GetInvoicesInput,
  ): Promise<InvoiceModel[]> {
    return await InvoiceModel.findAll({
      where: { toIdentifier: identifier },
      ...pagination,
      order: [['createdAt', 'DESC']],
    });
  }

  async getReceivedInvoicesCount(identifier: string): Promise<number> {
    return await InvoiceModel.count({ where: { toIdentifier: identifier } });
  }

  async getUnpaidInvoicesCount(identifier: string): Promise<number> {
    return await InvoiceModel.count({
      where: { toIdentifier: identifier, status: InvoiceStatus.PENDING },
    });
  }

  async getInvoiceById(id: number, transaction: Transaction): Promise<InvoiceModel | null> {
    return await InvoiceModel.findOne({ where: { id }, transaction });
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

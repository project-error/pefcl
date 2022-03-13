import { singleton } from 'tsyringe';
import { CashModel } from './cash.model';

@singleton()
export class CashDB {
  async getCashByIdentifier(ownerIdentifier: string): Promise<CashModel> {
    return await CashModel.findOne({ where: { ownerIdentifier } });
  }

  async createInitial(ownerIdentifier: string): Promise<CashModel> {
    const existing = await CashModel.findOne({ where: { ownerIdentifier } });
    return existing ?? (await CashModel.create({ ownerIdentifier }));
  }
}

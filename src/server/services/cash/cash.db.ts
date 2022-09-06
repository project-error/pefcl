import { Transaction } from 'sequelize/types';
import { singleton } from 'tsyringe';
import { CashModel } from './cash.model';

@singleton()
export class CashDB {
  async getCashByIdentifier(ownerIdentifier: string): Promise<CashModel | null> {
    return await CashModel.findOne({ where: { ownerIdentifier } });
  }

  async createInitial(ownerIdentifier: string): Promise<CashModel> {
    const existing = await CashModel.findOne({ where: { ownerIdentifier } });
    return existing ?? (await CashModel.create({ ownerIdentifier }));
  }

  async decrement(cash: CashModel, amount: number, transaction?: Transaction) {
    await cash?.update({ amount: cash.getDataValue('amount') - amount }, { transaction });
  }

  async increment(cash: CashModel, amount: number, transaction?: Transaction) {
    await cash?.update({ amount: cash.getDataValue('amount') + amount }, { transaction });
  }
}

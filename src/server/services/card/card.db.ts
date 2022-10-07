import { Transaction } from 'sequelize/types';
import { singleton } from 'tsyringe';
import { CardModel, CardModelCreate } from './card.model';

@singleton()
export class CardDB {
  async getAll(): Promise<CardModel[]> {
    return await CardModel.findAll();
  }

  async getById(cardId: number, transaction?: Transaction): Promise<CardModel | null> {
    return await CardModel.findOne({ where: { id: cardId }, transaction });
  }

  async getByAccountId(accountId: number): Promise<CardModel[]> {
    return await CardModel.findAll({ where: { accountId: accountId } });
  }

  async create(data: CardModelCreate, transaction: Transaction): Promise<CardModel> {
    return await CardModel.create(data, { transaction });
  }
}

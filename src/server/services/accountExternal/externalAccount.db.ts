import { ExternalAccountInput } from '@typings/Account';
import { singleton } from 'tsyringe';
import { ExternalAccountModel } from './externalAccount.model';

export interface RemoveFromSharedAccountInput {
  accountId: number;
  identifier: string;
}

@singleton()
export class ExternalAccountDB {
  async getAccounts(): Promise<ExternalAccountModel[]> {
    return await ExternalAccountModel.findAll();
  }

  async getAccountById(accountId: number): Promise<ExternalAccountModel | null> {
    return await ExternalAccountModel.findOne({ where: { id: accountId } });
  }

  async getAccountByNumber(number: string): Promise<ExternalAccountModel | null> {
    return await ExternalAccountModel.findOne({ where: { number } });
  }

  async getAccountsByUserId(userId: string): Promise<ExternalAccountModel[]> {
    return await ExternalAccountModel.findAll({ where: { userId } });
  }

  async getExistingAccount(userId: string, number: string): Promise<ExternalAccountModel | null> {
    return await ExternalAccountModel.findOne({ where: { userId, number } });
  }

  async create(input: ExternalAccountInput): Promise<ExternalAccountModel> {
    return await ExternalAccountModel.create(input);
  }
}

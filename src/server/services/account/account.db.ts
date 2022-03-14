import { singleton } from 'tsyringe';
import { Account } from '../../../../typings/accounts';
import { AccountModel } from './account.model';

@singleton()
export class AccountDB {
  async getAccounts(): Promise<AccountModel[]> {
    return await AccountModel.findAll();
  }

  async getDefaultAccountByIdentifier(identifier: string): Promise<AccountModel> {
    return await AccountModel.findOne({ where: { isDefault: true, ownerIdentifier: identifier } });
  }

  async getAccountsByIdentifier(identifier: string): Promise<AccountModel[]> {
    return await AccountModel.findAll({ where: { ownerIdentifier: identifier } });
  }

  async getAccount(id: number): Promise<AccountModel> {
    return await AccountModel.findOne({ where: { id } });
  }

  async editAccount(input: Partial<Account>) {
    return await AccountModel.update(input, {
      where: { id: input.id, ownerIdentifier: input.ownerIdentifier },
    });
  }

  async createAccount(
    account: Pick<Account, 'accountName' | 'type' | 'isDefault' | 'ownerIdentifier'>,
  ): Promise<AccountModel> {
    return await AccountModel.create(account);
  }

  async deleteAccount(id: number) {
    return await AccountModel.destroy({ where: { identifier: id } });
  }

  async updateAccountBalance(id: number, amount: number): Promise<void> {
    throw new Error('Not implemented');
  }
}

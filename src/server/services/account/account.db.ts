import { Account, SharedAccountInput } from '@typings/Account';
import { singleton } from 'tsyringe';
import { AccountModel } from './account.model';
import { SharedAccountModel } from './sharedAccount.model';

export interface RemoveFromSharedAccountInput {
  accountId: number;
  identifier: string;
}

@singleton()
export class AccountDB {
  async getAccounts(): Promise<AccountModel[]> {
    return await AccountModel.findAll();
  }

  async getDefaultAccountByIdentifier(identifier: string): Promise<AccountModel> {
    return await AccountModel.findOne({
      where: { isDefault: true, ownerIdentifier: identifier },
    });
  }

  async getAccountsByIdentifier(identifier: string): Promise<AccountModel[]> {
    return await AccountModel.findAll({ where: { ownerIdentifier: identifier } });
  }

  async getSharedAccountsByIdentifier(identifier: string): Promise<SharedAccountModel[]> {
    return await SharedAccountModel.findAll({
      where: { user: identifier },
      include: [{ model: AccountModel, as: 'account' }],
    });
  }

  async getSharedAccountsById(id: number): Promise<SharedAccountModel[]> {
    return await SharedAccountModel.findAll({
      where: { accountId: id },
      include: [{ model: AccountModel, as: 'account' }],
    });
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
    account: Pick<Account, 'accountName' | 'type' | 'isDefault' | 'ownerIdentifier' | 'role'>,
  ): Promise<AccountModel> {
    return await AccountModel.create(account);
  }

  async createSharedAccount(input: SharedAccountInput): Promise<SharedAccountModel> {
    // TODO: Move logic into service
    const existingAccount = await SharedAccountModel.findOne({
      where: { user: input.user, accountId: input.accountId },
    });

    if (existingAccount) {
      throw new Error('Shared account for player already exists!');
    }

    const account = await SharedAccountModel.create(input);

    // TODO: How to extend the module to support this with ts? Other ORM might be a choice if this isn't fixable.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await account.setAccount(input.accountId);
    return account;
  }

  async deleteSharedAccount(id: number) {
    return await SharedAccountModel.findOne({ where: { id } });
  }

  async deleteAccount(id: number) {
    return await AccountModel.destroy({ where: { identifier: id } });
  }

  async updateAccountBalance(): Promise<void> {
    throw new Error('Not implemented');
  }
}

import { Account, CreateAccountInput } from '@typings/Account';
import { ExternalAccountDB } from 'services/accountExternal/externalAccount.db';
import { singleton } from 'tsyringe';
import { AccountModel } from './account.model';

export interface RemoveFromSharedAccountInput {
  accountId: number;
  identifier: string;
}

@singleton()
export class AccountDB {
  _externalAccountDB: ExternalAccountDB;

  constructor(externalAccountDB: ExternalAccountDB) {
    this._externalAccountDB = externalAccountDB;
  }

  async getAccounts(): Promise<AccountModel[]> {
    return await AccountModel.findAll();
  }

  async getAccountById(id: number): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { id } });
  }

  async getAccountsByIdentifier(identifier: string): Promise<AccountModel[]> {
    return await AccountModel.findAll({ where: { ownerIdentifier: identifier } });
  }

  async getDefaultAccountByIdentifier(identifier: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({
      where: { isDefault: true, ownerIdentifier: identifier },
    });
  }

  async getAuthorizedAccountById(id: number, identifier: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { id, ownerIdentifier: identifier } });
  }

  async getAccountByNumber(number: string): Promise<AccountModel | null> {
    return await AccountModel.findOne({ where: { number } });
  }

  async createAccount(account: CreateAccountInput): Promise<AccountModel> {
    return await AccountModel.create(account);
  }
}

export enum AccountType {
	Personal = 'personal',
	Shared = 'shared'
}

export interface Account {
	id: string;
	accountName: string;
	type: AccountType;
	balance: string;
	participants?: string[];
	owner: boolean;
	isDefault: boolean;
}

export enum AccountEvents {
	GetAccounts = 'pe-fcl:getAccounts'
}
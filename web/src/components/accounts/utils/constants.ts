import { Account, AccountType } from "../../../../../typings/accounts";

export const MockAccounts: Account[] = [
	{
		id: 'sdjafi8weyw',
		accountName: "Default account",
		balance: "45.00",
		owner: true,
		isDefault: true,
		type: AccountType.Personal
	},
	{
		id: 'iwfiw99e08fwe',
		accountName: "Savings",
		balance: "9654.00",
		owner: true,
		isDefault: false,
		type: AccountType.Personal
	},
	{
		id: '0iweif9i9wue',
		accountName: "google_was_my_idea",
		balance: "0.00",
		owner: false,
		isDefault: false,
		type: AccountType.Shared
	},
]
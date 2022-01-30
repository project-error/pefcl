import { AccountDB } from './account.db';
import { singleton } from 'tsyringe';
import { Request } from '../../../typings/http';
import { Account, DepositDTO, PreDBAccount } from '../../../typings/accounts';
import { UserService } from '../user/user.service';
import { config } from '../server-config';

const exp = global.exports;

@singleton()
export class AccountService {
	private readonly _accountDB: AccountDB;
	private readonly _userService: UserService;
	
	constructor(accountDB: AccountDB, userService: UserService) {
		this._accountDB = accountDB;
		this._userService = userService;
	}
	
	async handleGetAccounts() {
		return await this._accountDB.getAccounts();
	}
	
	async handleCreateAccount(dto: Request<PreDBAccount>): Promise<Account> {
		const userIdentifier = this._userService.getUser(dto.source).getIdentifier();
		const accountId = await this._accountDB.createAccount(dto.data.accountName, userIdentifier);
		
		return await this._accountDB.getAccount(accountId);
	}
	
	async handleCreateDefaultAccount(source: number) {
		const userIdentifier = this._userService.getUser(source).getIdentifier();
		await this._accountDB.createAccount('Default account', userIdentifier, true);
	}
	
	/**
	 * Should call the export if the target account is default.
	 * Will then update whatever player's main bank account in any framework.
	 * @param req
	 */
	async handleDepositMoney(req: Request<DepositDTO>) {
		const tgtAccount = req.data.tgtAccount;
		const depositAmount = req.data.amount;
		const currentBalance = this._userService.getUser(req.source).getBalance();
		
		try {
			if (currentBalance >= depositAmount) {
				if (config.general.useFrameworkIntegration) {
					if (tgtAccount.isDefault) {
						exp[config.exports.resourceName].pefclDepositMoney(req.source, depositAmount);
					}
				}
				
				await this._accountDB.updateAccountBalance(tgtAccount, depositAmount);
			}
		} catch (err) {
			console.log(err.message);
		}
	}
}

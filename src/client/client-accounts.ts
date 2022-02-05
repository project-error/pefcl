import { RegisterNuiCB, RegisterNuiProxy } from './client-utils';
import { AccountEvents } from '../../typings/accounts';

RegisterNuiProxy(AccountEvents.GetAccounts);
RegisterNuiProxy(AccountEvents.CreateAccount);
RegisterNuiProxy(AccountEvents.DeleteAccount);

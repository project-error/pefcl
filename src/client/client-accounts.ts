import { RegisterNuiCB, RegisterNuiProxy } from './client-utils';
import { AccountEvents } from '../../typings/accounts';

RegisterNuiProxy(AccountEvents.GetAccounts);

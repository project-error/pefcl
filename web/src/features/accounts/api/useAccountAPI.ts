import { fetchNui } from '../../../utils/fetchNui';
import { Account, AccountEvents, PreDBAccount } from '../../../../../typings/accounts';
import { ServerPromiseResp } from '../../../../../typings/http';

interface IUseAccountAPI {
  createAccount: (accountName: string) => void;
}

export const useAccountAPI = () => {
  const createAccount = (accountDTO: PreDBAccount) => {
    fetchNui<PreDBAccount, ServerPromiseResp<Account>>(AccountEvents.CreateAccount, {
      accountName: accountDTO.accountName,
    }).then((res) => {
      if (res.status !== 'ok') {
        return 'something';
      }
    });
  };
};

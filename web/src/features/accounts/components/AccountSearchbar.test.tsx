import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot, snapshot_UNSTABLE, useRecoilValue } from 'recoil';
import AccountList from '../AccountList';
import { MockAccounts } from '../utils/constants';
import { accountsState, useAccountsValue, useSetFilteredAccounts } from '../hooks/accounts.state';
import { CircularProgress } from '@mui/material';
import { renderHook } from '@testing-library/react-hooks';
import { Search } from '@mui/icons-material';
import AccountsSidebar from '../AccountsSidebar';
import AccountSearchbar from './AccountSearchbar';
import { RecoilObserver } from '../../../test-utils/RecoilObserver';

describe('Filtering accounts', () => {
  it('Should search for default account', () => {
    const { result: filterInput } = renderHook(() => useSetFilteredAccounts(), {
      wrapper: RecoilRoot,
    });

    const onChange = jest.fn();
    render(
      <RecoilRoot>
        <React.Suspense fallback={<CircularProgress />}>
          <RecoilObserver node={accountsState.filterInput} onChange={onChange} />
          <AccountSearchbar />
        </React.Suspense>
      </RecoilRoot>,
    );

    const searchBar = screen.getByTestId('filter-accounts');
    expect(searchBar).toBeVisible();

    fireEvent.change(searchBar, { currentTarget: { value: 'Default account' } });
    filterInput.current('Default account');

    // https://recoiljs.org/docs/guides/testing/#testing-recoil-state-with-asyncronous-queries-inside-of-a-react-component
  });
});

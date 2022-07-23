import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import AccountCards from '../AccountCards';
import { renderWithProviders } from '@utils/test';
import { mockedAccounts } from '@utils/constants';

jest.mock('@utils/fetchNui', () => ({
  fetchNui: () => [mockedAccounts[0], mockedAccounts[1]],
}));

const Loading = () => {
  return <div data-testid="loading" />;
};
describe('Component: <AccountCards />', () => {
  test('should display add card button', async () => {
    renderWithProviders(
      <React.Suspense fallback={<Loading />}>
        <AccountCards />
      </React.Suspense>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTitle('create-account')).toBeInTheDocument();
  });

  test('should display cards', async () => {
    renderWithProviders(
      <React.Suspense fallback={<Loading />}>
        <AccountCards />
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByText(mockedAccounts[0].accountName)).toBeInTheDocument();
  });
});

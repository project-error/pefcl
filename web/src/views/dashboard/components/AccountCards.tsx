import { AccountCard, LoadingAccountCard } from '@components/Card';
import CreateAccountModal from '@components/Modals/CreateAccount';
import { orderedAccountsAtom } from '@data/accounts';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Add } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useState } from 'react';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  button {
    margin-top: ${theme.spacing(1)};
  }
`;

const Cards = styled.div`
  position: relative;
  min-height: 7.5rem;
  padding: 0;
  display: flex;
  overflow-x: auto;
  width: 100%;
  padding-bottom: ${theme.spacing(2)};

  & > * {
    min-width: 17rem;
    width: calc(25% - ${theme.spacing(1.5)});
    margin-right: ${theme.spacing(2)};

    &:last-child {
      margin-right: 0;
    }
  }
`;

const CreateCard = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.spacing(2)};
  border: 1px dashed ${theme.palette.grey[500]};
  font-size: 1.5rem;
  transition: 300ms;

  flex: 0;
  min-width: 5.5rem;
  width: 5.5rem;
  height: 5.5rem;

  :hover {
    color: ${theme.palette.primary.main};
    border: 1px dashed ${theme.palette.primary.main};
  }

  svg {
    font-size: 2.5rem;
  }
`;

interface AccountCardsProps {
  selectedAccountId?: number;
  onSelectAccount?: (id: number) => void;
}

const AccountCards = ({ onSelectAccount, selectedAccountId }: AccountCardsProps) => {
  const config = useConfig();
  const [orderedAccounts] = useAtom(orderedAccountsAtom);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        maxWidth="md"
        fullWidth
        hideBackdrop
      >
        <CreateAccountModal onClose={() => setIsCreateAccountOpen(false)} />
      </Dialog>

      <Cards>
        {orderedAccounts.map((account) => (
          <CardContainer key={account.id} onClick={() => onSelectAccount?.(account.id)}>
            <AccountCard account={account} selected={account.id === selectedAccountId} />
          </CardContainer>
        ))}

        {orderedAccounts.length < (config.accounts.maximumNumberOfAccounts || 4) && (
          <CreateCard onClick={() => setIsCreateAccountOpen(true)} title="create-account">
            <Add />
          </CreateCard>
        )}
      </Cards>
    </>
  );
};

export const LoadingCards = () => {
  return (
    <Cards>
      <LoadingAccountCard />
      <LoadingAccountCard />
      <LoadingAccountCard />
      <CreateCard>
        <Add />
      </CreateCard>
    </Cards>
  );
};

export default AccountCards;

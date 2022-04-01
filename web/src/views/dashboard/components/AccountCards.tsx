import { AccountCard, LoadingAccountCard } from '@components/Card';
import CreateAccountModal from '@components/Modals/CreateAccount';
import { orderedAccountsAtom } from '@data/accounts';
import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import { Account } from '@typings/Account';
import theme from '@utils/theme';
import { AnimatePresence, Reorder } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useState } from 'react';

const CardContainer = styled(Reorder.Item)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  button {
    margin-top: ${theme.spacing(1)};
  }
`;

const Cards = styled(Reorder.Group)`
  min-height: 7.5rem;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: ${theme.spacing(2.5)};
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

const AccountCards = () => {
  const [, setRefreshOrder] = useState({});
  const [orderedAccounts, setOrderedAccounts] = useAtom(orderedAccountsAtom);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  const handleReOrder = (accounts: Account[]) => {
    const order = accounts?.reduce((prev, curr, index) => ({ ...prev, [curr.id ?? 0]: index }), {});
    setOrderedAccounts(order);
    setRefreshOrder(order); // TODO: This would not be needed if the 'orderedAccounts' was updated. Not sure why it doesn't.
  };

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

      <Cards values={orderedAccounts} onReorder={handleReOrder} axis="x">
        <AnimatePresence initial={false}>
          {orderedAccounts.map((account) => (
            <CardContainer key={account.id} value={account}>
              <AccountCard account={account} />
            </CardContainer>
          ))}
        </AnimatePresence>

        {orderedAccounts.length < 4 && (
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
    <Cards values={[]} onReorder={() => null}>
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

import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountType } from '@typings/Account';
import { useConfig } from '../hooks/useConfig';
import { MasterCardIcon } from '../icons/MasterCardIcon';
import { formatMoney } from '../utils/currency';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading3, Heading5, Heading6 } from './ui/Typography/Headings';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { ContentCopyRounded } from '@mui/icons-material';
import copy from 'copy-to-clipboard';

const Container = styled.div<{ accountType: AccountType; selected: boolean }>`
  user-select: none;
  width: 100%;
  padding: 1rem;
  background: ${({ accountType }) =>
    accountType === AccountType.Personal
      ? 'linear-gradient(90deg, #264f82 0%, #1d3757 100%)'
      : 'linear-gradient(90deg, rgb(45, 58, 75) 0%, #263140 100%)'};

  border-radius: 1rem;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 0.5rem;

  cursor: pointer;
  transition: 250ms;
  box-shadow: ${theme.shadows[4]};

  :hover {
    box-shadow: ${theme.shadows[6]};
  }

  transition: 200ms ease-in-out;
  border: 2px solid transparent;

  ${({ selected }) =>
    selected &&
    `
    border: 2px solid ${theme.palette.background.light8};
  `};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RowEnd = styled(Row)`
  align-items: flex-end;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Type = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StyledIcon = styled(MasterCardIcon)`
  color: rgba(255, 255, 255, 0.54);
`;

const DefaultText = styled(Heading6)`
  text-transform: uppercase;
  font-weight: ${theme.typography.fontWeightLight};
`;

type AccountCardProps = {
  account: Account;
  selected?: boolean;
};

export const AccountCard = ({ account, selected = false, ...props }: AccountCardProps) => {
  const { type, id, balance, isDefault, accountName, number } = account;
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <Container {...props} key={id} accountType={type} selected={selected}>
      <Row>
        <Heading3>{formatMoney(balance, config.general)}</Heading3>
        <Type>
          <Heading6>{type === AccountType.Shared ? t('SHARED') : t('PERSONAL')}</Heading6>
          {isDefault && <DefaultText>{t('Default')}</DefaultText>}
        </Type>
      </Row>

      <Stack direction="row" alignItems="center">
        <Heading5>{number}</Heading5>
        <IconButton
          onClick={() => copy(number)}
          size="small"
          color="inherit"
          style={{ opacity: '0.45', marginTop: 0, marginLeft: '0.25rem' }}
        >
          <ContentCopyRounded color="inherit" fontSize="small" />
        </IconButton>
      </Stack>

      <RowEnd>
        <Col>
          <Heading6>{t('Account name')}</Heading6>
          <BodyText>{accountName}</BodyText>
        </Col>

        <StyledIcon />
      </RowEnd>
    </Container>
  );
};

export const LoadingAccountCard = () => {
  return (
    <Container accountType={AccountType.Personal} selected={false}>
      <Row>
        <Heading3>
          <Skeleton variant="text" width={120} />
        </Heading3>
        <Type>
          <Heading6>
            <Skeleton variant="text" width={70} />
          </Heading6>
          <DefaultText>
            <Skeleton variant="text" width={40} />
          </DefaultText>
        </Type>
      </Row>

      <Heading5>
        <Skeleton variant="text" width="65%" />
      </Heading5>

      <RowEnd>
        <Col>
          <Heading6>
            <Skeleton variant="text" width={80} />
          </Heading6>
          <BodyText>
            <Skeleton variant="text" width={60} />
          </BodyText>
        </Col>

        <StyledIcon />
      </RowEnd>
    </Container>
  );
};

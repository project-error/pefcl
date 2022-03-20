import styled from '@emotion/styled';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';
import { css, Stack } from '@mui/material';
import theme from '@utils/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading6 } from './ui/Typography/Headings';

const CharacterBox = styled.div<{ isDisabled?: boolean; isActive?: boolean }>`
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 2rem;
  height: 2rem;
  padding: 0 0.73rem;

  color: ${theme.palette.grey[600]};
  border-radius: ${theme.spacing(1)};
  font-weight: ${theme.typography.fontWeightBold};
  background-color: ${theme.palette.background.light4};

  :hover {
    color: ${theme.palette.primary.dark};
    background-color: ${theme.palette.background.light8};
  }
  :active {
    background-color: ${theme.palette.background.light2};
  }

  ${({ isActive }) => isActive && `color: ${theme.palette.primary.main}`}

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      cursor: not-allowed;
      color: ${theme.palette.grey[700]};
      background-color: ${theme.palette.background.light2};
      :active,
      :hover {
        color: ${theme.palette.grey[700]};
        background-color: ${theme.palette.background.light2};
        background-color: ${theme.palette.background.light2};
      }
    `}
`;

interface PaginationProps {
  limit: number;
  total: number;
  offset: number;
  onChange(offset: number): void;
}

const Pagination = ({ limit, offset, total, onChange }: PaginationProps) => {
  const { t } = useTranslation();
  const currentMax = offset + limit;
  const to = currentMax > total ? total : currentMax;
  const pages = Math.ceil(total / limit);
  const list = new Array(pages).fill(1);
  const currentPage = Math.ceil(to / limit - 1);

  const isPrevDisabled = offset === 0;
  const isNextDisabled = offset + limit > total;

  const handlePageChange = (page: number) => {
    onChange(limit * page);
  };

  return (
    <Stack spacing={1.5} alignItems="flex-end">
      <Heading6>
        {t('{{from}}-{{to}} of {{total}}', {
          to,
          total,
          from: offset + 1,
        })}
      </Heading6>

      <Stack direction="row" spacing={1} alignItems="flex-end">
        <CharacterBox
          isDisabled={isPrevDisabled}
          onClick={() => !isPrevDisabled && handlePageChange(currentPage - 1)}
        >
          <ArrowLeftRounded />
        </CharacterBox>

        {list.map((_num, index) => (
          <CharacterBox
            key={index}
            isActive={index === currentPage}
            onClick={() => index !== currentPage && handlePageChange(index)}
          >
            {index + 1}
          </CharacterBox>
        ))}

        <CharacterBox
          isDisabled={isNextDisabled}
          onClick={() => !isNextDisabled && handlePageChange(currentPage + 1)}
        >
          <ArrowRightRounded />
        </CharacterBox>
      </Stack>
    </Stack>
  );
};

export default Pagination;

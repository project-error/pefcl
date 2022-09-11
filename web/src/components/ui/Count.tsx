import styled from '@emotion/styled';
import theme from '@utils/theme';
import React from 'react';

const Total = styled.div<{ focus: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  height: 2rem;
  padding: 0 0.73rem;

  border-radius: ${theme.spacing(1)};
  font-weight: ${theme.typography.fontWeightBold};
  background-color: ${theme.palette.background.light4};

  ${({ focus }) =>
    focus &&
    `
      background-color: ${theme.palette.background.light8};
  `}
`;

interface CountProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: string | number;
  focus?: boolean;
}
const Count = ({ amount, focus = false, ...props }: CountProps) => {
  return (
    <div {...props}>
      <Total focus={focus}>{amount}</Total>
    </div>
  );
};

export default Count;

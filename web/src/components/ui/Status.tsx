import { SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { ChipProps, css } from '@mui/material';
import theme from '@utils/theme';
import React from 'react';
import { BodyText } from './Typography/BodyText';

type Color = Exclude<ChipProps['color'], undefined>;

const colors: Record<Color, SerializedStyles> = {
  default: css`
    color: red;
  `,
  primary: css``,
  secondary: css``,
  error: css``,
  info: css``,
  success: css`
    color: ${theme.palette.success.contrastText};
    background-color: ${theme.palette.primary.dark};
  `,
  warning: css``,
};

const Container = styled.div<{ color: Color }>`
  text-transform: uppercase;
  padding: 0.35rem 1.25rem;
  border-radius: ${theme.spacing(1)};

  color: ${theme.palette.primary.main};
  background-color: ${theme.palette.background.light2};

  span {
    font-size: 0.875rem;
    font-weight: ${theme.typography.fontWeightBold};
  }

  ${({ color }) => colors[color]}
`;

interface StatusProps {
  label: string;
  color: Color;
}
const Status: React.FC<StatusProps> = (props) => {
  return (
    <Container color={props.color}>
      <BodyText>{props.label}</BodyText>
    </Container>
  );
};

export default Status;

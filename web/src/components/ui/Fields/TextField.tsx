import styled from '@emotion/styled';
import { InputBase, InputBaseProps } from '@mui/material';
import React from 'react';
import theme from '../../../utils/theme';
import { Heading5 } from '../Typography/Headings';

const Container = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  border-radius: ${theme.spacing(1)};
  background-color: ${theme.palette.background.dark12};

  & > div {
    flex: 1;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled(Heading5)`
  margin-bottom: 0.5rem;
`;

interface TextFieldProps extends InputBaseProps {
  label?: string;
}
const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <LabelWrapper>
      {props.label && <Label>{props.label}</Label>}
      <Container>
        <InputBase {...props} />
      </Container>
    </LabelWrapper>
  );
};

export default TextField;

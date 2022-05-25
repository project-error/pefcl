import styled from '@emotion/styled';
import { InputBase, InputBaseProps, StandardTextFieldProps, Typography } from '@mui/material';
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

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    color: white !important;
    -webkit-text-fill-color: white !important;
    box-shadow: 0 0 0 30px rgb(16 26 37) inset !important;
    -webkit-box-shadow: 0 0 0 30px rgb(16 26 37) inset !important;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled(Heading5)`
  margin-bottom: 0.5rem;
`;

const HelperText = styled(Typography)`
  margin-top: 0.5rem;
`;

interface Props extends InputBaseProps {
  label?: string;
  helperText?: string;
  InputProps?: StandardTextFieldProps['InputProps'];
  InputLabelProps?: StandardTextFieldProps['InputLabelProps'];
}
const TextField = ({ InputProps, InputLabelProps, helperText, ...props }: Props) => {
  return (
    <LabelWrapper>
      {props.label && <Label {...InputLabelProps}>{props.label}</Label>}
      <Container>
        <InputBase {...InputProps} {...props} />
      </Container>

      {helperText && (
        <HelperText variant="caption" color="error">
          {helperText}
        </HelperText>
      )}
    </LabelWrapper>
  );
};

export default TextField;

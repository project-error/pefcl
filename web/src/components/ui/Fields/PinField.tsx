import styled from '@emotion/styled';
import { InputBaseProps, Stack, Typography } from '@mui/material';
import { PIN_CODE_LENGTH } from '@shared/constants';
import React, { ChangeEvent, useState } from 'react';
import Count from '../Count';

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${`repeat(${PIN_CODE_LENGTH}, 1fr)`};
  grid-column-gap: 0.5rem;
  width: ${`calc(${PIN_CODE_LENGTH} * 3rem)`};
`;

const InputField = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
`;

interface PinFieldProps {
  label?: string;
  value: string;
  onChange: InputBaseProps['onChange'];
}

const PinField = ({ onChange, value, label }: PinFieldProps) => {
  const [hasFocus, setHasFocus] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const newLength = newValue.length;

    if (newValue && isNaN(parseInt(newValue, 10))) {
      return;
    }

    if (newLength > PIN_CODE_LENGTH && value.length < newLength) {
      return;
    }

    onChange?.(event);
  };

  const codeLen = new Array(PIN_CODE_LENGTH).fill('');

  return (
    <Stack spacing={0.5}>
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      <Container>
        <InputField
          onChange={handleChange}
          value={value}
          onBlur={() => setHasFocus(false)}
          onFocus={() => setHasFocus(true)}
        />

        {codeLen.map((_val, index) => (
          <Count key={index} amount={value[index] ? '*' : ''} focus={hasFocus} />
        ))}
      </Container>
    </Stack>
  );
};

export default PinField;

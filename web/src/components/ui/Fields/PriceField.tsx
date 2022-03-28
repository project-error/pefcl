import { InputAdornment, InputBase, InputBaseProps } from '@mui/material';
import React, { ChangeEventHandler } from 'react';
import { useConfig } from '@hooks/useConfig';
import { formatMoneyWithoutCurrency, getCurrencySign, getSignLocation } from '@utils/currency';
import BaseFieldStyles from './BaseField.styles';

const Input: React.FC<InputBaseProps> = (props) => {
  const config = useConfig();
  const currencySignLocation = getSignLocation(config);
  const isLocationBefore = currencySignLocation === 'before';
  const currencySign = getCurrencySign(config);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = formatMoneyWithoutCurrency(Number(value), config.general.language);

    if (!value) {
      props.onChange?.(event);
      return;
    }

    const formattedEvent = {
      ...event,
      target: { ...event.target, value: formattedValue },
    };

    props.onChange?.(formattedEvent);
  };

  return (
    <BaseFieldStyles>
      <InputBase
        {...props}
        onChange={handleChange}
        startAdornment={
          !isLocationBefore ? null : (
            <InputAdornment position="start">{currencySign}</InputAdornment>
          )
        }
        endAdornment={
          isLocationBefore ? null : <InputAdornment position="end">{currencySign}</InputAdornment>
        }
      />
    </BaseFieldStyles>
  );
};

export default Input;

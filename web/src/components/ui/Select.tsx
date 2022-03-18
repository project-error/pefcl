import React from 'react';
import { InputBase, Select as BaseSelect, SelectProps as BaseSelectProps } from '@mui/material';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { ArrowDropDownRounded } from '@mui/icons-material';

const StyledInput = styled(InputBase)`
  border-radius: ${theme.spacing(1)};
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.dark12};

  & > div {
    padding: 0.75rem 1rem;
  }
`;

const SelectIcon = styled(ArrowDropDownRounded)`
  color: ${theme.palette.text.primary};
  color: white !important;
  margin-right: 0.5rem;
`;

interface SelectProps extends BaseSelectProps<string> {
  label?: string;
}
const Select = (props: SelectProps) => {
  return (
    <BaseSelect
      {...props}
      onChange={props.onChange}
      variant="filled"
      input={<StyledInput sx={{ border: 'none', outline: 'none' }} placeholder="select" />}
      sx={{ width: '100%' }}
      IconComponent={(props) => {
        return <SelectIcon {...props} />;
      }}
    ></BaseSelect>
  );
};

export default Select;

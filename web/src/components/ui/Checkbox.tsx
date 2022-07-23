import styled from '@emotion/styled';
import { CheckboxProps, Checkbox as BaseCheckbox } from '@mui/material';
import React from 'react';
import CheckIcon from '../../icons/CheckIcon';
import theme from '../../utils/theme';

const BaseBox = styled.div`
  width: 2rem;
  height: 2rem;

  border-radius: ${theme.spacing(0.5)};
  background-color: ${theme.palette.background.dark12};

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: inherit;
    height: inherit;
  }
`;

const CheckedBox = styled(BaseBox)`
  background-color: ${theme.palette.background.light4};
`;

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <div>
      <BaseCheckbox
        {...props}
        disableRipple
        checkedIcon={
          <CheckedBox>
            <CheckIcon />
          </CheckedBox>
        }
        icon={<BaseBox />}
      />
    </div>
  );
};

export default Checkbox;

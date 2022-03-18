import styled from '@emotion/styled';
import theme from '../../../utils/theme';

export default styled.div`
  display: flex;
  padding: 1rem;
  border-radius: ${theme.spacing(1)};
  background-color: ${theme.palette.background.dark12};

  & > div {
    flex: 1;
  }
`;

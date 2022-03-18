import styled from '@emotion/styled';
import theme from '../../../utils/theme';

const BaseText = styled.span`
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeightLight};
`;

export const PreHeading = styled(BaseText)`
  font-size: 0.9rem;
`;

export const BodyText = styled(BaseText)`
  font-size: 1rem;
`;

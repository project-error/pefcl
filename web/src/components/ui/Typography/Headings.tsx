import styled from '@emotion/styled';
import theme from '../../../utils/theme';

const BaseHeading = styled.span`
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeightBold};
`;

export const Heading1 = styled(BaseHeading)`
  font-size: 2.5rem;
`;

export const Heading2 = styled(BaseHeading)`
  font-size: 2rem;
`;

export const Heading3 = styled(BaseHeading)`
  font-size: 1.5rem;
`;
export const Heading4 = styled(BaseHeading)`
  font-size: 1.25rem;
`;

export const Heading5 = styled(BaseHeading)`
  font-size: 1rem;
  color: ${theme.palette.text.secondary};
`;

export const Heading6 = styled(BaseHeading)`
  font-size: 0.75rem;
  color: ${theme.palette.text.secondary};
`;

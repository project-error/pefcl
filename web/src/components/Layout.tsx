import styled from '@emotion/styled';
import React from 'react';

const Container = styled.div`
  padding: 3rem;
`;

const Layout: React.FC = ({ children }) => {
  return <Container>{children}</Container>;
};

export default Layout;

import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import { Heading2, Heading5 } from './ui/Typography/Headings';
import { AnimatePresence, motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  position: relative;
  height: 100%;
`;

const Content = styled.div`
  padding: 2rem;
  flex: 1;
  height: 100%;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Layout: React.FC<{ title?: string }> = ({ children, title }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Sidebar />
      <AnimatePresence>
        <Content>
          <Heading2>{title}</Heading2>
          <React.Suspense
            fallback={
              <LoadingContainer>
                <Heading5>{t('Loading {{name}} view ..', { name: title })}</Heading5>
                <Box p={4}>
                  <CircularProgress />
                </Box>
              </LoadingContainer>
            }
          >
            {children}
          </React.Suspense>
        </Content>
      </AnimatePresence>
    </Container>
  );
};

export default Layout;

import styled from '@emotion/styled';
import { Settings } from '@mui/icons-material';
import { Fab, Stack, Typography } from '@mui/material';
import theme from '@utils/theme';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Button from './ui/Button';

const Container = styled(motion.div)`
  width: 100%;
  padding: 1rem;
  position: absolute;
  background: ${theme.palette.background.default};
  color: #fefefe;
`;

const FabContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;

const Devbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isAtmOpen, setIsAtmOpen] = useState(false);

  useEffect(() => {
    if (isBankOpen) {
      window.postMessage({ type: 'setVisible', payload: true });
      window.postMessage({ type: 'setVisibleATM', payload: false });
    } else {
      window.postMessage({ type: 'setVisible', payload: false });
    }
  }, [isBankOpen]);

  useEffect(() => {
    if (isAtmOpen) {
      window.postMessage({ type: 'setVisible', payload: false });
      window.postMessage({ type: 'setVisibleATM', payload: true });
    } else {
      window.postMessage({ type: 'setVisibleATM', payload: false });
    }
  }, [isAtmOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Container exit={{ y: -100 }} initial={{ y: -100 }} animate={{ y: 0 }}>
            <Stack spacing={1}>
              <Typography variant="caption">Devbar</Typography>
              <Stack direction="row" spacing={2}>
                <Button onClick={() => setIsAtmOpen((prev) => !prev)}>
                  {isAtmOpen ? 'Close' : 'Open'} ATM
                </Button>
                <Button onClick={() => setIsBankOpen((prev) => !prev)}>
                  {isBankOpen ? 'Close' : 'Open'} Bank
                </Button>
              </Stack>
            </Stack>
          </Container>
        )}
      </AnimatePresence>

      <FabContainer>
        <Fab color="secondary" onClick={() => setIsOpen((prev) => !prev)}>
          <Settings />
        </Fab>
      </FabContainer>
    </>
  );
};

export default Devbar;

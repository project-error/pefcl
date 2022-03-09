import styled from '@emotion/styled';
import { MenuItem, MenuList, Popover } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LayoutHeader from './LayoutHeader';

const Container = styled.div`
  position: relative;
  padding: 3rem;
`;

const Layout: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <LayoutHeader />

      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={menuRef.current}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList>
          <MenuItem title="transfer" value="Transfer">
            <span>{t('Transfer funds')}</span>
          </MenuItem>
        </MenuList>
      </Popover>

      {children}
    </Container>
  );
};

export default Layout;

import styled from '@emotion/styled';
import { MenuItem, MenuList, Popover } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LayoutHeader from './LayoutHeader';
import { Heading2 } from './ui/Typography/Headings';

const Container = styled.div`
  position: relative;
  padding: 3rem;
  height: 100%;
`;

const Content = styled.div`
  height: 100%;
`;

const Layout: React.FC<{ title?: string }> = ({ children, title }) => {
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

      <Content>
        <Heading2>{title}</Heading2>
        {children}
      </Content>
    </Container>
  );
};

export default Layout;

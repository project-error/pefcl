import { Badge, BadgeProps } from '@mui/material';
import { Atom, useAtom } from 'jotai';
import React, { ReactNode } from 'react';

interface BadgeAtomProps extends BadgeProps {
  children: ReactNode;
  countAtom: Atom<number>;
}

const BadgeAtomContent = ({ countAtom, children }: BadgeAtomProps) => {
  const [amount] = useAtom(countAtom);

  return (
    <Badge color="error" badgeContent={amount}>
      {children}
    </Badge>
  );
};

const BadgeAtom = (props: BadgeAtomProps) => {
  return (
    <React.Suspense fallback={<Badge badgeContent={'..'} {...props} />}>
      <BadgeAtomContent {...props} />
    </React.Suspense>
  );
};

export default BadgeAtom;

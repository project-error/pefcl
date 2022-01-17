import { useEffect } from 'react';
import { AtomOptions, useRecoilValue } from 'recoil';

export const RecoilObserver = ({ node, onChange }: { node: any; onChange: any }): null => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

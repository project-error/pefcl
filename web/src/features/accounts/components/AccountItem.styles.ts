import styled from '@emotion/styled';

export const Item = styled('div')(({ selected }: any) => ({
  background: '#42464A',
  color: '#fff',
  border: selected ? '2px solid #B5B5B5' : '2px solid #42464A',
  height: '60px',
  boxSizing: 'border-box',
  borderRadius: 7,
  marginTop: 14,
  paddingLeft: 10,
  paddingTop: 5,
  display: 'flex',
  flexDirection: 'column',
}));

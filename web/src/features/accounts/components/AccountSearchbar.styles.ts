import styled from '@emotion/styled';

export const StyledBase = styled('div')({
  marginBottom: 10,
  paddingBottom: 4,
  paddingTop: 4,
  paddingRight: 10,
  background: '#42464A',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 7,
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
});

export const InputBase = styled('input')({
  paddingLeft: 1,
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontWeight: 500,
  fontSize: 15,
  textIndent: 5,
  '&::placeholder': {
    color: '#B5B5B5',
  },
});

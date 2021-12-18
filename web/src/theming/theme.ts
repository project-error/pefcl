import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      paper: '#C4C1E0',
      default: '#FAFAFA',
    },
    primary: {
      main: '#7C73E6',
      contrastText: '#fff',
    },
    text: {
      primary: '#232323',
    },
  },
});

export default theme;

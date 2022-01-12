import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      paper: '#383838',
      default: '#212121',
    },
    primary: {
      main: '#16C79A',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#ddd',
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'sans-serif'",
  },
});

export default theme;

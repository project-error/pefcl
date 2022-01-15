import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      paper: '#383838',
      default: '#212121',
    },
    primary: {
      light: '#fff',
      main: '#12A581',
      contrastText: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#ddd',
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        divider: '#ddd',
      },
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'sans-serif'",
  },
});

export default theme;

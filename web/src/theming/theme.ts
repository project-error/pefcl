import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      paper: '#2c3036',
      default: '#212529',
    },
    primary: {
      light: '#fff',
      main: '#d84e4b',
      contrastText: '#fff',
    },
    divider: '#2c3036',
    action: {
      selectedOpacity: 1,
    },
    common: {
      white: '#2c3036',
    },
    text: {
      primary: '#fff',
      secondary: '#ddd',
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'sans-serif'",
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        selected: {
          background: '#fff',
          backgroundColor: '#fff',
        },
        root: {
          height: 60,
          borderRadius: 1,
        },
      },
    },
  },
});

export default theme;

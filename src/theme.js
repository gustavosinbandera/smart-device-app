import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9'   // puedes ajustar estos valores
    },
    secondary: {
      main: '#f48fb1'
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#1f1f1f',
        }
      }
    }
  }
});

export default theme;

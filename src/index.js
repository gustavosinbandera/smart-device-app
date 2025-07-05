// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// MUI Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: {
      default: '#121212',
      paper:   '#1d1d1d'
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />    {/* Aplica reset + dark background */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();

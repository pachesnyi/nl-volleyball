'use client';

import { createTheme } from '@mui/material/styles';

// Create a theme instance with custom colors matching the existing design
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0070f3', // Blue from NextUI config
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7828c8', // Purple from NextUI config
      contrastText: '#ffffff',
    },
    success: {
      main: '#17c964', // Green from NextUI config
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f5a524', // Orange from NextUI config
      contrastText: '#000000',
    },
    error: {
      main: '#f31260', // Red from NextUI config
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#11181C',
      secondary: '#687076',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0070f3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7828c8',
      contrastText: '#ffffff',
    },
    success: {
      main: '#17c964',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f5a524',
      contrastText: '#000000',
    },
    error: {
      main: '#f31260',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0F0F0F',
      paper: '#18181B',
    },
    text: {
      primary: '#ECEDEE',
      secondary: '#A1A1AA',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(24, 24, 27, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
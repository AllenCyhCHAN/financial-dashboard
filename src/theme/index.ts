import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Cool Dark Purple Theme
const darkPurpleThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#673ab7', // Deep Purple
      light: '#9575cd',
      dark: '#512da8',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50', // Green
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336', // Red
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    info: {
      main: '#2196f3', // Blue
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a', // Very dark background
      paper: '#1a1a1a', // Dark purple-tinted paper
    },
    text: {
      primary: '#e1bee7', // Light purple text
      secondary: '#b39ddb', // Medium purple text
    },
    divider: '#2d2d2d',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#e1bee7',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#e1bee7',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#e1bee7',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#e1bee7',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#e1bee7',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#e1bee7',
    },
    body1: {
      color: '#e1bee7',
    },
    body2: {
      color: '#b39ddb',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #2d2d2d',
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(156, 39, 176, 0.2)',
            border: '1px solid #9c27b0',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(156, 39, 176, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(156, 39, 176, 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #2d2d2d',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0a0a',
          borderRight: '1px solid #2d2d2d',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1a1a',
            '& fieldset': {
              borderColor: '#2d2d2d',
            },
            '&:hover fieldset': {
              borderColor: '#9c27b0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9c27b0',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#1a1a1a',
          },
          '&:hover': {
            backgroundColor: '#2d2d2d',
          },
        },
      },
    },
  },
};

export const darkPurpleTheme = createTheme(darkPurpleThemeOptions);

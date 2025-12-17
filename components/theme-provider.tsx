'use client'

import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  mode: 'light' | 'dark';
};

export function ThemeProvider({ children, mode }: Props) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#667eea',
                },
                secondary: {
                  main: '#764ba2',
                },
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff',
                },
              }
            : {
                primary: {
                  main: '#667eea',
                },
                secondary: {
                  main: '#764ba2',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
        typography: {
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === 'light'
                    ? '0 2px 8px rgba(0,0,0,0.1)'
                    : '0 2px 8px rgba(0,0,0,0.3)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

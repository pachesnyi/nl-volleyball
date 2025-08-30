'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { theme, darkTheme } from '@/theme/theme';
import { useEffect, useState } from 'react';

function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={nextTheme === 'dark' ? darkTheme : theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" themes={['light', 'dark']}>
      <MuiThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MuiThemeProvider>
    </NextThemesProvider>
  );
}
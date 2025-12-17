'use client'

import { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider } from './theme-provider';
import { ThemeMode } from '@/types/models';

type Props = {
  children: ReactNode;
};

export function AppWrapper({ children }: Props) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('dashboard-theme') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard-theme' && e.newValue) {
        setTheme(e.newValue as ThemeMode);
      }
    };

    const handleCustomThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      setTheme(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-change', handleCustomThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-change', handleCustomThemeChange);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeProvider mode={theme}>{children}</ThemeProvider>;
}

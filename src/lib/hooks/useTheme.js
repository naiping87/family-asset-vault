'use client';
import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'fav-theme';

export function useTheme() {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) || 'dark';
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}

function applyTheme(t) {
  if (t === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
}

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('theme');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-lg bg-card border border-border hover:bg-accent transition-colors duration-200 flex items-center justify-center group"
      aria-label={t('toggle')}
      title={t('toggle')}
    >
      <SunIcon className="h-5 w-5 text-foreground transition-transform duration-200 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-5 w-5 text-foreground transition-transform duration-200 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      
      <span className="sr-only">{t('toggle')}</span>
    </button>
  );
} 
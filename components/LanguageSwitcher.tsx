'use client';

import { useState } from 'react';
import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('languages');

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    // In a real implementation, this would change the locale
    // For now, we'll just close the dropdown
    setIsOpen(false);
    
    // Redirect to the new locale
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${languageCode}`);
    window.location.href = newPath || `/${languageCode}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors duration-200"
        aria-label={t('switch')}
        title={t('switch')}
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <LanguageIcon className="h-4 w-4 text-foreground" />
        <ChevronDownIcon className={`h-3 w-3 text-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-32 bg-card border border-border rounded-lg shadow-lg z-10">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                locale === language.code ? 'bg-accent text-accent-foreground' : 'text-foreground'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 
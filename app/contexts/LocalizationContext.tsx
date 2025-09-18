'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../locales/en';
import es from '../locales/es';

type Translations = typeof en;
type TranslationKey = keyof Translations;
type Language = 'en' | 'es';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { en, es };

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey, fallback: string = key): string => {
    return translations[language][key] || fallback;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

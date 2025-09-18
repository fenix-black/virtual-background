'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

// Helper function to detect and map browser language
const detectBrowserLanguage = (): Language => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return 'en';
  }

  // Check localStorage for saved preference first
  const savedLanguage = localStorage.getItem('preferred-language');
  if (savedLanguage === 'en' || savedLanguage === 'es') {
    return savedLanguage as Language;
  }

  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  
  // Map browser language codes to our supported languages
  // This handles cases like 'es-ES', 'es-MX' -> 'es' and 'en-US', 'en-GB' -> 'en'
  const languageCode = browserLang.toLowerCase().split('-')[0];
  
  // Check if we support this language
  if (languageCode === 'es') {
    return 'es';
  }
  
  // Default to English for all other languages
  return 'en';
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with default language to avoid hydration mismatch
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Detect and set language after mount to avoid hydration issues
  useEffect(() => {
    if (!isInitialized) {
      const detectedLanguage = detectBrowserLanguage();
      setLanguage(detectedLanguage);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const t = useCallback((key: TranslationKey, fallback: string = key): string => {
    return translations[language][key] || fallback;
  }, [language]);

  // Handle language change and save preference
  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
    }
  }, []);

  // Update document language attribute for better accessibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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

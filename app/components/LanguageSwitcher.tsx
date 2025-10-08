'use client';

import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface LanguageSwitcherProps {
  onLanguageToggle?: (lang: 'en' | 'es') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageToggle }) => {
  const { language, setLanguage, t } = useLocalization();
  
  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLanguage(lang);
    if (onLanguageToggle) {
      onLanguageToggle(lang);
    }
  };

  return (
    <div className="inline-flex items-center gap-1 bg-gray-800/50 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {t('language_en')}
      </button>
      <span className="text-gray-600">|</span>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === 'es'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {t('language_es')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
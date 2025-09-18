'use client';

import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  return (
    <div className="inline-flex items-center gap-1 bg-gray-800/50 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => setLanguage('en')}
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
        onClick={() => setLanguage('es')}
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
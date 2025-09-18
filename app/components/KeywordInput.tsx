'use client';

import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange, disabled }) => {
  const { t } = useLocalization();

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-white mb-4">{t('keyword_input_step')}</h2>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('keywords_placeholder')}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="text-sm text-gray-500 mt-2">{t('keywords_hint')}</p>
    </div>
  );
};

export default KeywordInput;

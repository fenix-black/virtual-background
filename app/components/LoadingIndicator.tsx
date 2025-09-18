'use client';

import React from 'react';
import { LoadingState } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface LoadingIndicatorProps {
  state: LoadingState;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ state }) => {
  const { t } = useLocalization();

  const getMessage = () => {
    switch (state) {
      case LoadingState.ANALYZING:
        return t('analyzing');
      case LoadingState.GENERATING:
        return t('generating');
      default:
        return '';
    }
  };

  return (
    <div className="text-center p-8 animate-fade-in">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
      <p className="text-xl text-gray-300">{getMessage()}</p>
    </div>
  );
};

export default LoadingIndicator;

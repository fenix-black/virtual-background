'use client';

import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { RegenerateIcon } from './icons/RegenerateIcon';
import { useLocalization } from '../contexts/LocalizationContext';
import VirtualTryOn from './VirtualTryOn';
import { TryOnIcon } from './icons/TryOnIcon';
import { TurnOffIcon } from './icons/TurnOffIcon';
import { track } from '@vercel/analytics';

interface ResultsDisplayProps {
  generatedImage: string | null;
  error: string | null;
  onRegenerate: () => void;
  onStartOver: () => void;
  styleUsed?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ generatedImage, error, onRegenerate, onStartOver, styleUsed }) => {
  const { t } = useLocalization();
  const [isTryingOn, setIsTryingOn] = useState(false);

  const handleDownload = () => {
    if (generatedImage) {
      // Track download
      track('background_downloaded', {
        style: styleUsed || 'unknown'
      });
      
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImage}`;
      link.download = 'virtual-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleToggleTryOn = () => {
    setIsTryingOn(prev => !prev);
  };

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg w-full max-w-lg animate-fade-in">
        <h3 className="text-2xl font-bold text-red-400 mb-2">{t('results_failed_title')}</h3>
        <p className="text-red-300 mb-6">{error}</p>
        <button
          onClick={onStartOver}
          className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
        >
          {t('start_over_button')}
        </button>
      </div>
    );
  }

  if (generatedImage) {
    const imageUrl = `data:image/png;base64,${generatedImage}`;
    return (
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{t('results_title')}</h2>
             {styleUsed && (
                <span className="inline-block bg-indigo-500/20 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full">
                    {styleUsed}
                </span>
            )}
        </div>
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl shadow-indigo-900/50 mb-6 border-2 border-indigo-500">
            {isTryingOn ? (
                <VirtualTryOn backgroundImageB64={generatedImage} />
            ) : (
                <img src={imageUrl} alt="Generated virtual background" className="w-full h-full object-cover" />
            )}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
            >
                <DownloadIcon />
                {t('download_button')}
            </button>
            <button
                onClick={handleToggleTryOn}
                className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    isTryingOn 
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700'
                    : 'bg-gradient-to-r from-blue-500 to-sky-600 text-white hover:from-blue-600 hover:to-sky-700'
                }`}
            >
                {isTryingOn ? <TurnOffIcon /> : <TryOnIcon />}
                {isTryingOn ? t('turn_off_button') : t('try_on_button')}
            </button>
            <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors"
            >
                <RegenerateIcon />
                {t('regenerate_button')}
            </button>
             <button
                onClick={onStartOver}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {t('start_over_button')}
            </button>
        </div>
      </div>
    );
  }

  return null; // Should not happen if logic in App.tsx is correct
};

export default ResultsDisplay;

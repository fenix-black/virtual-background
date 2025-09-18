'use client';

import React, { useState, useCallback, useEffect } from 'react';
import LogoUploader from './components/LogoUploader';
import StyleSelector from './components/StyleSelector';
import LoadingIndicator from './components/LoadingIndicator';
import ResultsDisplay from './components/ResultsDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { LoadingState } from './types';
import { analyzeLogoStyle, generateVirtualBackground } from './services/geminiService';
import { useLocalization, LocalizationProvider } from './contexts/LocalizationContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import KeywordInput from './components/KeywordInput';

const AppContent: React.FC = () => {
  const { t } = useLocalization();
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [dimension, setDimension] = useState<'2D' | '3D'>('3D');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoAnalysis, setLogoAnalysis] = useState<string | null>(null);
  
  // Clean up object URL when component unmounts or logo changes
  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const handleLogoSelect = (file: File) => {
    setLogoFile(file);
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }
    setLogoPreviewUrl(URL.createObjectURL(file));
    // Reset analysis when logo changes
    setLogoAnalysis(null);
  };

  const handleGeneration = useCallback(async () => {
    if (!logoFile || !selectedStyle) {
      return;
    }
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    setGeneratedImage(null);
    
    try {
      // Step 1: Analyze Logo
      let analysis = logoAnalysis;
      if (!analysis) { // Only analyze if we haven't already
        analysis = await analyzeLogoStyle(logoFile);
        setLogoAnalysis(analysis);
      }
      
      // Step 2: Generate Background
      setLoadingState(LoadingState.GENERATING);
      const imageB64 = await generateVirtualBackground(logoFile, analysis, selectedStyle, dimension, keywords);
      setGeneratedImage(imageB64);
      setLoadingState(LoadingState.DONE);
    } catch (err) {
      const errorMessageKey = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
      const localizedError = t(errorMessageKey as any, t('UNKNOWN_ERROR'));
      setError(localizedError);
      setLoadingState(LoadingState.ERROR);
      setLogoAnalysis(null); // Clear analysis on error to force re-analysis
    }
  }, [logoFile, selectedStyle, logoAnalysis, dimension, keywords, t]);

  const handleRegenerate = () => {
    // Re-run generation, using cached logo analysis if available
    handleGeneration();
  };

  const handleStartOver = () => {
    setLoadingState(LoadingState.IDLE);
    setLogoFile(null);
    setLogoPreviewUrl(null);
    setSelectedStyle(null);
    setDimension('3D');
    setGeneratedImage(null);
    setError(null);
    setLogoAnalysis(null);
    setKeywords('');
  };
  
  const isGenerationDisabled = !logoFile || !selectedStyle;
  
  const renderContent = () => {
    switch (loadingState) {
      case LoadingState.ANALYZING:
      case LoadingState.GENERATING:
        return <LoadingIndicator state={loadingState} />;
      case LoadingState.DONE:
      case LoadingState.ERROR:
        return <ResultsDisplay generatedImage={generatedImage} error={error} onRegenerate={handleRegenerate} onStartOver={handleStartOver} styleUsed={`${dimension} ${selectedStyle}`} />;
      case LoadingState.IDLE:
      default:
        return (
          <div className="w-full max-w-6xl flex flex-col items-center gap-8 animate-fade-in">
             <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                {t('app_title')}
              </h1>
              <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
                {t('app_subtitle')}
              </p>
              <LanguageSwitcher />
            </div>
            <div className="w-full p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/50 flex flex-col gap-8 border border-gray-700/50">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">{t('upload_logo_step')}</h2>
                <LogoUploader onLogoSelect={handleLogoSelect} logoPreviewUrl={logoPreviewUrl} />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">{t('keyword_input_step')}</h2>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder={t('keywords_placeholder')}
                  disabled={!logoFile}
                  className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:border-indigo-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
                />
              </div>
              
              <StyleSelector 
                onStyleSelect={setSelectedStyle} 
                selectedStyle={selectedStyle} 
                disabled={!logoFile}
                dimension={dimension}
                onDimensionChange={setDimension}
              />
            </div>

            <button
                onClick={handleGeneration}
                disabled={isGenerationDisabled}
                className={`inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl ${
                    isGenerationDisabled
                        ? 'bg-gray-700 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-600/30'
                }`}
            >
                <SparklesIcon />
                {t('generate_button')}
            </button>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center gap-8">
            {renderContent()}
            <footer className="text-center text-gray-500 text-sm">
                {t('made_by')} <a href="https://www.fenixblack.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors underline">FenixBlack.ai</a>
            </footer>
        </div>
    </main>
  );
};

export default function Page() {
  useEffect(() => {
    // Load MediaPipe scripts if not already loaded
    const loadMediaPipe = async () => {
      // First load the helper script
      if (!document.querySelector('script[src="/mediapipe-loader.js"]')) {
        const helperScript = document.createElement('script');
        helperScript.src = '/mediapipe-loader.js';
        document.head.appendChild(helperScript);
        
        await new Promise(resolve => {
          helperScript.onload = resolve;
        });
      }

      // Then load MediaPipe
      if (!document.querySelector('script[src*="selfie_segmentation.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    };

    loadMediaPipe();
  }, []);

  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
}
'use client';

import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { track } from '@vercel/analytics';

interface StyleSelectorProps {
  onStyleSelect: (style: string) => void;
  selectedStyle: string | null;
  disabled?: boolean;
  dimension: '2D' | '3D';
  onDimensionChange: (dimension: '2D' | '3D') => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  onStyleSelect, 
  selectedStyle, 
  disabled,
  dimension,
  onDimensionChange
}) => {
  const { t } = useLocalization();

  const handleStyleSelect = (styleId: string) => {
    track('style_selected', {
      style: styleId,
      dimension: dimension,
      previous_style: selectedStyle || 'none'
    });
    onStyleSelect(styleId);
  };

  const handleDimensionChange = (newDimension: '2D' | '3D') => {
    track('dimension_changed', {
      from: dimension,
      to: newDimension,
      current_style: selectedStyle || 'none'
    });
    onDimensionChange(newDimension);
  };

  const styles = [
    { id: 'Cozy', label: t('style_cozy'), description: t('style_cozy_desc') },
    { id: 'Professional', label: t('style_professional'), description: t('style_professional_desc') },
    { id: 'Natural', label: t('style_natural'), description: t('style_natural_desc') },
    { id: 'Futuristic', label: t('style_futuristic'), description: t('style_futuristic_desc') },
    { id: 'Creative', label: t('style_creative'), description: t('style_creative_desc') },
    { id: 'Urban', label: t('style_urban'), description: t('style_urban_desc') },
    { id: 'Elegant', label: t('style_elegant'), description: t('style_elegant_desc') },
    { id: 'Abstract', label: t('style_abstract'), description: t('style_abstract_desc') },
  ];

  return (
    <div className={disabled ? 'opacity-50 cursor-not-allowed' : ''}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{t('style_selector_step')}</h2>
        
        {/* Dimension Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDimensionChange('3D')}
            disabled={disabled}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              dimension === '3D'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {t('dimension_3d')}
          </button>
          <button
            onClick={() => handleDimensionChange('2D')}
            disabled={disabled}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              dimension === '2D'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {t('dimension_2d')}
          </button>
        </div>
      </div>

      {/* Style Cards - 3 column grid on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => !disabled && handleStyleSelect(style.id)}
            disabled={disabled}
            className={`p-5 rounded-xl border transition-all duration-300 text-left ${
              selectedStyle === style.id
                ? 'border-indigo-500 bg-gray-700/50 shadow-lg shadow-indigo-500/20'
                : 'border-gray-600/50 bg-gray-800/30 hover:bg-gray-700/40 hover:border-gray-500'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{style.label}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{style.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
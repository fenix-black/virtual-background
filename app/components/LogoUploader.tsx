'use client';

import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface LogoUploaderProps {
  onLogoSelect: (file: File) => void;
  logoPreviewUrl: string | null;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoSelect, logoPreviewUrl }) => {
  const { t } = useLocalization();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onLogoSelect(file);
      }
    },
    [onLogoSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onLogoSelect(file);
      }
    },
    [onLogoSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-600/50 rounded-xl p-12 text-center hover:border-indigo-500/50 hover:bg-gray-700/20 transition-all cursor-pointer"
    >
      <label htmlFor="logo-upload" className="cursor-pointer">
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {logoPreviewUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img 
              src={logoPreviewUrl} 
              alt="Logo preview" 
              className="max-h-24 max-w-full object-contain"
            />
            <p className="text-base text-gray-400">{t('logo_uploader_text')}</p>
            <p className="text-sm text-gray-500">{t('logo_uploader_hint')}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadIcon />
            <p className="text-lg font-medium text-gray-300">{t('logo_uploader_text')}</p>
            <p className="text-sm text-gray-500">{t('logo_uploader_hint')}</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default LogoUploader;
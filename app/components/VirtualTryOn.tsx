'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface VirtualTryOnProps {
  backgroundImageB64: string;
}

// Declare global for MediaPipe SelfieSegmentation
declare global {
  interface Window {
    SelfieSegmentation: any;
  }
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ backgroundImageB64 }) => {
  const { t } = useLocalization();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const segmentationRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError(t('virtual_tryon_error'));
      }
    };

    const initSegmentation = async () => {
      // Wait for MediaPipe to load
      let attempts = 0;
      while (!window.SelfieSegmentation && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.SelfieSegmentation) {
        setError(t('virtual_tryon_error'));
        return;
      }

      const selfieSegmentation = new window.SelfieSegmentation({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
        }
      });

      selfieSegmentation.setOptions({
        modelSelection: 1,
        selfieMode: true,
      });

      selfieSegmentation.onResults(onResults);
      segmentationRef.current = selfieSegmentation;
    };

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw background
      const backgroundImage = new Image();
      backgroundImage.onload = () => {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background image
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Apply segmentation mask
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

        // Draw person on top
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        
        // Draw background behind person
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        
        ctx.restore();
      };
      backgroundImage.src = `data:image/png;base64,${backgroundImageB64}`;

      setIsLoading(false);
    };

    const processVideo = async () => {
      if (!segmentationRef.current || !videoRef.current || videoRef.current.readyState !== 4) {
        animationIdRef.current = requestAnimationFrame(processVideo);
        return;
      }

      try {
        await segmentationRef.current.send({ image: videoRef.current });
      } catch (error) {
        console.error('Segmentation error:', error);
      }
      
      animationIdRef.current = requestAnimationFrame(processVideo);
    };

    const init = async () => {
      await setupCamera();
      await initSegmentation();
      processVideo();
    };

    init();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (segmentationRef.current) {
        segmentationRef.current.close();
      }
    };
  }, [backgroundImageB64, t]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-800">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-white">{t('virtual_tryon_loading')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;

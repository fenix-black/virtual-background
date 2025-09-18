'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { track } from '@vercel/analytics';

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
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;
    const sessionStartTime = Date.now();

    // Preload the background image
    const bgImage = new Image();
    bgImage.src = `data:image/png;base64,${backgroundImageB64}`;
    bgImage.onload = () => {
      backgroundImageRef.current = bgImage;
    };

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });

        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        if (mounted) {
          setError(t('virtual_tryon_error'));
          setIsLoading(false);
        }
      }
    };

    const initSegmentation = async () => {
      try {
        // Wait for MediaPipe to load
        let attempts = 0;
        while (!window.SelfieSegmentation && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.SelfieSegmentation) {
          throw new Error('MediaPipe SelfieSegmentation not loaded');
        }

        const selfieSegmentation = new window.SelfieSegmentation({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
          }
        });

        selfieSegmentation.setOptions({
          modelSelection: 1,  // Use model 1 for better accuracy
          selfieMode: false,  // Set to false for video stream
        });

        selfieSegmentation.onResults((results: any) => {
          if (!mounted) return;
          onResults(results);
        });

        segmentationRef.current = selfieSegmentation;
        
        // Start processing after setup
        if (mounted) {
          processVideo();
        }
      } catch (err) {
        console.error('Segmentation init error:', err);
        if (mounted) {
          setError(t('virtual_tryon_error'));
          setIsLoading(false);
        }
      }
    };

    const onResults = (results: any) => {
      if (!canvasRef.current || !backgroundImageRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = results.image.width;
      canvas.height = results.image.height;

      ctx.save();
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the background image
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
      
      // Create a temporary canvas for the person
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // Draw the person on temporary canvas
        tempCtx.drawImage(results.image, 0, 0);
        
        // Apply the segmentation mask
        tempCtx.globalCompositeOperation = 'destination-in';
        tempCtx.drawImage(results.segmentationMask, 0, 0);
        
        // Draw the person on the main canvas
        ctx.drawImage(tempCanvas, 0, 0);
      }
      
      ctx.restore();
      setIsLoading(false);
    };

    const processVideo = async () => {
      const processFrame = async () => {
        if (!segmentationRef.current || !videoRef.current || !mounted) {
          return;
        }

        if (videoRef.current.readyState === 4) {
          try {
            await segmentationRef.current.send({ image: videoRef.current });
          } catch (error) {
            console.error('Error processing frame:', error);
          }
        }
        
        if (mounted) {
          animationIdRef.current = requestAnimationFrame(processFrame);
        }
      };

      // Start the processing loop
      processFrame();
    };

    const init = async () => {
      await setupCamera();
      if (mounted) {
        await initSegmentation();
      }
    };

    // Delay initialization slightly to ensure component is fully mounted
    const initTimeout = setTimeout(() => {
      init();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      
      // Track virtual try-on session duration
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      track('virtual_tryon_duration', {
        duration_seconds: sessionDuration
      });
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (segmentationRef.current) {
        try {
          segmentationRef.current.close();
        } catch (e) {
          console.error('Error closing segmentation:', e);
        }
      }
    };
  }, [backgroundImageB64, t]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-red-400 p-4 text-center">
        <div>
          <p className="mb-2">{error}</p>
          <p className="text-sm text-gray-500">Make sure to allow camera access and try refreshing the page if the issue persists.</p>
        </div>
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
        onLoadedMetadata={(e) => {
          const video = e.target as HTMLVideoElement;
          video.play();
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/75">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-white text-center">{t('virtual_tryon_loading')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
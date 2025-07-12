"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface QRScannerPageProps {
  onBack?: () => void;
  onQRScanned?: (data: string) => void;
}

export default function QRScannerPage({ onBack, onQRScanned }: QRScannerPageProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsScanning(false);
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
      detectionTimeoutRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoadingCamera(true);
    setCameraError(null);

    try {
      console.log('Iniciando proceso de cámara...');
      
      // Verificar si estamos en un entorno que soporta getUserMedia
      if (!navigator.mediaDevices) {
        throw new Error('MediaDevices no está disponible');
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia no está disponible');
      }

      console.log('MediaDevices disponible, solicitando permisos...');

      // Configuraciones de cámara idénticas a KYC
      const constraints = [
        {
          video: {
            facingMode: { exact: 'environment' },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 30 }
          }
        },
        {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        },
        {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        },
        {
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30 }
          }
        },
        {
          video: true
        }
      ];

      let stream = null;
      let lastError = null;

      for (const constraint of constraints) {
        try {
          console.log('Intentando configuración:', constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          console.log('Stream obtenido exitosamente');
          break;
        } catch (error) {
          console.log('Configuración falló:', constraint, error);
          lastError = error;
          continue;
        }
      }

      if (!stream) {
        throw lastError || new Error('No se pudo acceder a ninguna cámara');
      }
      
      streamRef.current = stream;
      
      // Mostrar la vista de cámara inmediatamente
      setShowCamera(true);
      setIsLoadingCamera(false);
      
      // Esperar un poco para que el DOM se actualice
      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          try {
            await videoRef.current.play();
            console.log('Video iniciado correctamente');
          } catch (playError) {
            console.error('Error al reproducir video:', playError);
            // Intentar reproducir sin audio
            videoRef.current.muted = true;
            await videoRef.current.play();
          }
        }
      }, 100);
    } catch (error: unknown) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'No se pudo acceder a la cámara.';
      
      if (error instanceof Error) {
        console.error('Error name:', error.name, 'Message:', error.message);
        
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración del navegador.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No se encontró ninguna cámara en este dispositivo.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'La cámara no es compatible con este navegador.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'La cámara está siendo usada por otra aplicación.';
        } else if (error.name === 'AbortError') {
          errorMessage = 'El acceso a la cámara fue interrumpido.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Las configuraciones de cámara solicitadas no son compatibles.';
        } else {
          errorMessage = `Error de cámara: ${error.message}`;
        }
      }
      
      setCameraError(errorMessage);
      setIsLoadingCamera(false);
    }
  }, []);

  const handleQRDetected = useCallback((data: string) => {
    console.log('QR detectado:', data);
    setIsScanning(false);
    stopCamera();
    onQRScanned?.(data);
  }, [stopCamera, onQRScanned]);

  const startQRDetection = useCallback(() => {
    console.log('Iniciando detección QR...');
    setIsScanning(true);
    
    detectionTimeoutRef.current = setTimeout(() => {
      console.log('QR detectado (simulado)');
      const mockQRData = "bank:Banco Nacional:1234567890:Cuenta de Ahorros";
      handleQRDetected(mockQRData);
    }, 3000);
  }, [handleQRDetected]);

  const handleCapture = useCallback(() => {
    setCameraError(null);
    startCamera();
  }, [startCamera]);

  const handleBack = useCallback(() => {
    stopCamera();
    onBack?.();
  }, [stopCamera, onBack]);

  // Iniciar cámara automáticamente al cargar el componente
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  return (
    <div className="qr-scanner-full-screen">
      <main className="qr-scanner-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-black text-white">
          <button onClick={handleBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Escanear código QR</h1>
          <div className="w-10"></div>
        </header>

        {/* Camera View */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-60 flex flex-col">
            <div className="flex-1 relative overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay={true}
                playsInline={true}
                muted={true}
                style={{
                  transform: 'scaleX(1)',
                  filter: 'none',
                  imageRendering: 'auto'
                }}
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded');
                  console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                }}
                onPlay={() => {
                  console.log('Video started playing');
                  // Iniciar detección automáticamente cuando el video esté listo
                  if (!isScanning) {
                    startQRDetection();
                  }
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                }}
              />
              
              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Marco para QR */}
                  <div className="w-64 h-64 border-2 border-white rounded-lg relative bg-transparent">
                    {isScanning && (
                      <div className="absolute inset-4 border border-[#2A906F] animate-pulse"></div>
                    )}
                    {/* Esquinas del marco */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                  </div>
                  {/* Texto de instrucción */}
                  <div className="absolute -top-12 left-0 right-0 text-center">
                    <p className="text-white text-sm font-medium drop-shadow-lg">
                      {isScanning ? "Escaneando código QR..." : "Apunta al código QR"}
                    </p>
                    <p className="text-white text-xs mt-1 opacity-80 drop-shadow-lg">
                      Coloca el código QR dentro del marco
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Header con botón de cerrar */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <button
                  onClick={stopCamera}
                  className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Botón de cancelar escaneo */}
              {isScanning && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <button
                    onClick={() => {
                      setIsScanning(false);
                      if (detectionTimeoutRef.current) {
                        clearTimeout(detectionTimeoutRef.current);
                        detectionTimeoutRef.current = null;
                      }
                    }}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Cancelar escaneo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content - Solo mostrar cuando hay error */}
        {!showCamera && cameraError && (
          <section className="flex-1 bg-black relative flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4">
                  <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="#EF4444" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="#EF4444" strokeWidth="2"/>
                </svg>
              </div>
              <p className="text-red-400 mb-4 text-sm leading-relaxed">{cameraError}</p>
              <button 
                onClick={() => {
                  setCameraError(null);
                  handleCapture();
                }}
                className="bg-[#2A906F] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#1F6B52] transition-colors"
              >
                Intentar de nuevo
              </button>
              
              {/* Botón de prueba directo */}
              <button 
                onClick={() => {
                  const mockData = "bank:Banco Prueba:9876543210:Cuenta Test";
                  handleQRDetected(mockData);
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors block mx-auto"
              >
                Simular QR (Debug)
              </button>
            </div>
          </section>
        )}

        {/* Loading Camera */}
        {isLoadingCamera && !showCamera && (
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-4 border-[#2A906F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Iniciando cámara...</p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .qr-scanner-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          z-index: 50;
        }

        .qr-scanner-main {
          height: 100vh;
          max-width: 390px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          background: black;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";


interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  transactionType: "deposito" | "retiro";
}

export default function KYCModal({ isOpen, onClose, onComplete, transactionType }: KYCModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar KYC como completado
      localStorage.setItem("kyc_completed", "true");
      onComplete();
    }
  }, [currentStep, onComplete]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
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

      // Configuraciones de cámara más específicas para mejor calidad
      const constraints = [
        // Primero intentar con cámara trasera y alta calidad
        {
          video: {
            facingMode: { exact: 'environment' },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 30 }
          }
        },
        // Si falla, intentar con cualquier cámara trasera
        {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        },
        // Si falla, usar la cámara frontal
        {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        },
        // Configuración básica con buena calidad
        {
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30 }
          }
        },
        // Configuración mínima
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
          errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración del navegador o de la aplicación.';
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

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        
        stopCamera();
        
        // Continuar al siguiente paso después de capturar
        setTimeout(() => {
          setCapturedImage(null);
          handleNext();
        }, 2000);
      }
    }
  }, [stopCamera, handleNext]);

  const handleCapture = useCallback(() => {
    setCameraError(null);
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Limpiar la cámara cuando se cierre el modal
  React.useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-[360px] h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <button onClick={handleClose} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Verificación KYC</h1>
          <div className="w-10"></div>
        </header>

        {/* Progress Bar */}
        <div className="px-4 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#2A906F] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Paso {currentStep} de 5</p>
        </div>

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
                  transform: 'scaleX(1)', // Efecto espejo para mejor UX
                  filter: 'none',
                  imageRendering: 'auto'
                }}
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded');
                  console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                }}
                onPlay={() => {
                  console.log('Video started playing');
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                }}
              />
              
              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Guía rectangular para el carnet */}
                  <div className="w-80 h-52 border-2 border-white rounded-lg relative bg-transparent">
                    {/* Esquinas para mejor guía visual */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white"></div>
                  </div>
                  {/* Texto de instrucción */}
                  <div className="absolute -top-12 left-0 right-0 text-center">
                    <p className="text-white text-sm font-medium drop-shadow-lg">
                      {currentStep === 3 ? "Anverso del carnet" : "Reverso del carnet"}
                    </p>
                    <p className="text-white text-xs mt-1 opacity-80 drop-shadow-lg">
                      Coloca tu carnet dentro del marco
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
              
              {/* Camera controls */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="bg-white p-4 rounded-full shadow-lg border-4 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="fixed inset-0 bg-black z-60 flex items-center justify-center">
            <div className="text-center">
              <Image 
                src={capturedImage} 
                alt="Captured" 
                width={320} 
                height={240} 
                className="rounded-lg mb-4" 
              />
              <p className="text-white text-lg">Foto capturada correctamente</p>
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
          {currentStep === 1 && (
            <div>
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4z" stroke="#3B82F6" strokeWidth="2"/>
                  <path d="M16 20l4 4 8-8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4">Verificación Requerida</h2>
              <p className="text-gray-600 mb-6">
                Para realizar {transactionType === "deposito" ? "depósitos" : "retiros"}, necesitamos verificar tu identidad por primera vez.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Este proceso solo se requiere una vez y toma aproximadamente 3 minutos.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M13.333 20h13.334M13.333 16h13.334M13.333 24h8" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M33.333 8.333v23.334A3.333 3.333 0 0130 35H10a3.333 3.333 0 01-3.333-3.333V8.333A3.333 3.333 0 0110 5h20a3.333 3.333 0 013.333 3.333z" stroke="#10B981" strokeWidth="2"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4">Documentos Requeridos</h2>
              <p className="text-gray-600 mb-6">
                Necesitaremos los siguientes documentos para completar tu verificación:
              </p>
              <div className="text-left space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Documento de identidad (CI/Pasaporte)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Selfie con tu documento</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Comprobante de domicilio</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="10" width="28" height="20" rx="2" stroke="#3B82F6" strokeWidth="2"/>
                  <path d="M14 18h12M14 22h8" stroke="#3B82F6" strokeWidth="1.5"/>
                  <circle cx="25" cy="16" r="2" stroke="#3B82F6" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4">Anverso del Carnet</h2>
              <p className="text-gray-600 mb-6">
                Toma una foto clara del frente de tu carnet de identidad. Asegúrate de que:
              </p>
              <div className="text-left space-y-2 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">La foto sea nítida y legible</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">No haya reflejos o sombras</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">El documento esté completo</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="10" width="28" height="20" rx="2" stroke="#8B5CF6" strokeWidth="2"/>
                  <path d="M12 16h16M12 20h12M12 24h8" stroke="#8B5CF6" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4">Reverso del Carnet</h2>
              <p className="text-gray-600 mb-6">
                Ahora toma una foto clara del reverso de tu carnet de identidad. Verifica que:
              </p>
              <div className="text-left space-y-2 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">La información sea visible</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">No esté cortado o borroso</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sea la parte posterior del mismo documento</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M33.333 18.333v-5A3.333 3.333 0 0030 10H10a3.333 3.333 0 00-3.333 3.333v13.334A3.333 3.333 0 0010 30h7.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 25l3.333 3.333L35 21.667" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="20" cy="18.333" r="5" stroke="#10B981" strokeWidth="2"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-4">¡Verificación Completada!</h2>
              <p className="text-gray-600 mb-6">
                Tu cuenta ha sido verificada exitosamente. Ahora puedes realizar {transactionType === "deposito" ? "depósitos" : "retiros"} sin restricciones.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Esta verificación es válida para todas tus transacciones futuras.
              </p>
            </div>
          )}
        </div>

        {/* Camera Error Modal */}
        {cameraError && (
          <div className="fixed inset-0 bg-black/75 z-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#EF4444" strokeWidth="2"/>
                    <path d="M16 12V18M16 22H16.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Error de Cámara</h3>
                <p className="text-gray-600 mb-6 text-sm">{cameraError}</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCameraError(null);
                      startCamera();
                    }}
                    className="w-full bg-[#2A906F] text-white py-2 rounded-lg font-medium"
                  >
                    Intentar de nuevo
                  </button>
                  <button
                    onClick={() => setCameraError(null)}
                    className="w-full text-gray-500 py-2 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Camera */}
        {isLoadingCamera && (
          <div className="fixed inset-0 bg-black/75 z-70 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 border-4 border-[#2A906F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Iniciando cámara...</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6">
          {(currentStep === 3 || currentStep === 4) ? (
            <div className="space-y-3">
              <button
                onClick={handleCapture}
                disabled={isLoadingCamera}
                className="w-full bg-[#2A906F] text-white py-3 rounded-lg font-medium hover:bg-[#1F6B52] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 13.75A3.75 3.75 0 1 0 10 6.25a3.75 3.75 0 0 0 0 7.5Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M2.5 6.25h2.083L6.25 3.75h7.5l1.667 2.5H17.5a1.25 1.25 0 0 1 1.25 1.25v8.75a1.25 1.25 0 0 1-1.25 1.25H2.5a1.25 1.25 0 0 1-1.25-1.25V7.5a1.25 1.25 0 0 1 1.25-1.25Z" stroke="white" strokeWidth="1.5"/>
                </svg>
                {isLoadingCamera ? 'Iniciando...' : 'Abrir Cámara'}
              </button>
              <p className="text-xs text-gray-500 text-center">
                Se solicitarán permisos de cámara la primera vez
              </p>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-[#2A906F] text-white py-3 rounded-lg font-medium hover:bg-[#1F6B52] transition-colors"
            >
              {currentStep === 1 ? "Comenzar Verificación" : 
               currentStep === 2 ? "Entendido" : 
               "Continuar con " + (transactionType === "deposito" ? "Depósito" : "Retiro")}
            </button>
          )}
          
          {currentStep < 5 && (
            <button
              onClick={handleClose}
              className="w-full text-gray-500 py-3 mt-2 font-medium"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}


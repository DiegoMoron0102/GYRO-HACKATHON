"use client";

import React, { useState } from "react";

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  transactionType: "deposito" | "retiro";
}

export default function KYCModal({ isOpen, onClose, onComplete, transactionType }: KYCModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar KYC como completado
      localStorage.setItem("kyc_completed", "true");
      onComplete();
    }
  };

  const handleCapture = () => {
    // Simular captura de foto
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-[360px] h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <button onClick={onClose} className="p-2">
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

        {/* Footer */}
        <div className="p-6">
          {(currentStep === 3 || currentStep === 4) ? (
            <button
              onClick={handleCapture}
              className="w-full bg-[#2A906F] text-white py-3 rounded-lg font-medium hover:bg-[#1F6B52] transition-colors flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13.75A3.75 3.75 0 1 0 10 6.25a3.75 3.75 0 0 0 0 7.5Z" stroke="white" strokeWidth="1.5"/>
                <path d="M2.5 6.25h2.083L6.25 3.75h7.5l1.667 2.5H17.5a1.25 1.25 0 0 1 1.25 1.25v8.75a1.25 1.25 0 0 1-1.25 1.25H2.5a1.25 1.25 0 0 1-1.25-1.25V7.5a1.25 1.25 0 0 1 1.25-1.25Z" stroke="white" strokeWidth="1.5"/>
              </svg>
              Tomar Foto {currentStep === 3 ? "del Anverso" : "del Reverso"}
            </button>
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
              onClick={onClose}
              className="w-full text-gray-500 py-3 mt-2 font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

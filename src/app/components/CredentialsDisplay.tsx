"use client";

import React, { useState } from "react";

interface CredentialsDisplayProps {
  publicKey: string;
  secretKey: string;
  onContinue: () => void;
  onBack?: () => void;
}

export default function CredentialsDisplay({ 
  publicKey, 
  secretKey, 
  onContinue, 
  onBack 
}: CredentialsDisplayProps) {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: 'public' | 'secret') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const downloadCredentials = () => {
    const credentials = {
      publicKey,
      secretKey,
      network: "Testnet",
      createdAt: new Date().toISOString(),
      note: "⚠️ IMPORTANTE: Guarda estas credenciales en un lugar seguro. La clave secreta es necesaria para realizar transacciones."
    };

    const blob = new Blob([JSON.stringify(credentials, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stellar-credentials-${publicKey.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-600">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 ¡Cuenta Creada Exitosamente!
            </h2>
            <p className="text-gray-600">
              Tu cuenta de Stellar ha sido creada y registrada en los smart contracts.
            </p>
          </div>

          <div className="space-y-6">
            {/* Clave Pública */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Clave Pública (Dirección)</label>
                <button
                  onClick={() => copyToClipboard(publicKey, 'public')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {copied === 'public' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-3">
                <p className="font-mono text-sm break-all text-gray-900">{publicKey}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Esta es tu dirección pública. Puedes compartirla para recibir pagos.
              </p>
            </div>

            {/* Clave Secreta */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-red-700">Clave Secreta</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    {showSecretKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                  {showSecretKey && (
                    <button
                      onClick={() => copyToClipboard(secretKey, 'secret')}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {copied === 'secret' ? '✓ Copiado' : 'Copiar'}
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white border border-red-200 rounded-md p-3">
                {showSecretKey ? (
                  <p className="font-mono text-sm break-all text-red-900">{secretKey}</p>
                ) : (
                  <p className="font-mono text-sm text-red-600">••••••••••••••••••••••••••••••••</p>
                )}
              </div>
              <div className="mt-2 p-3 bg-red-100 rounded-md">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ IMPORTANTE: 
                </p>
                <ul className="text-xs text-red-700 mt-1 space-y-1">
                  <li>• Guarda esta clave en un lugar seguro</li>
                  <li>• Nunca la compartas con nadie</li>
                  <li>• Es necesaria para realizar depósitos y transacciones</li>
                  <li>• Si la pierdes, perderás acceso a tu cuenta</li>
                </ul>
              </div>
            </div>

            {/* Botón de descarga */}
            <div className="text-center">
              <button
                onClick={downloadCredentials}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Descargar Credenciales
              </button>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">¿Qué sigue?</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Tu cuenta ya está registrada en los smart contracts</li>
                <li>• Puedes hacer depósitos usando tu clave secreta</li>
                <li>• El balance se mostrará automáticamente en el dashboard</li>
                <li>• Esta es una cuenta de testnet (para pruebas)</li>
              </ul>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-6">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Volver
              </button>
            )}
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Continuar al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
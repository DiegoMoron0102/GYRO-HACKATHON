"use client";

import React, { useState } from "react";
import { useStellarAuth } from "@/hooks/useStellarAuth";
import { saveSecretKey } from "@/utils/secretKeyManager";

interface SecretKeyInputProps {
  userAddress?: string;
  onAuthenticated: () => void;
  onCancel: () => void;
}

export default function SecretKeyInput({ userAddress, onAuthenticated, onCancel }: SecretKeyInputProps) {
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { authenticate } = useStellarAuth({ userAddress });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = authenticate(secretKey);
      
      if (result.success) {
        // Guardar la clave secreta en localStorage (solo para MVP)
        if (userAddress) {
          saveSecretKey(userAddress, secretKey);
        }
        onAuthenticated();
      } else {
        setError(result.error || "Error de autenticación");
      }
    } catch {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            🔐 Autenticación Requerida
          </h2>
          <p className="text-sm text-gray-600">
            Para realizar depósitos, necesitamos tu clave secreta de Stellar
          </p>
          {userAddress && (
            <p className="text-xs text-gray-500 mt-2">
              Dirección: {userAddress.slice(0, 8)}...{userAddress.slice(-8)}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-2">
              Clave Secreta
            </label>
            <input
              type="password"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="SABC123..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Solo para MVP - En producción usaríamos un wallet seguro
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !secretKey}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Autenticando..." : "Autenticar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
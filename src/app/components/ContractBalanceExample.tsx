"use client";

/// <reference types="react" />
import React from 'react';
import { useContractBalance } from '@/hooks/useContractBalance';

interface ContractBalanceExampleProps {
  userAddress?: string;
}

export default function ContractBalanceExample({ userAddress }: ContractBalanceExampleProps) {
  const { balance, loading, error, refreshBalance } = useContractBalance({
    userAddress,
    assetType: "USDC"
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Balance del Contrato</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Estado:</span>
          <span className={`text-sm font-medium ${
            loading ? 'text-blue-600' : 
            error ? 'text-red-600' : 
            'text-green-600'
          }`}>
            {loading ? 'Cargando...' : 
             error ? 'Error' : 
             'Conectado'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Balance USDC:</span>
          <span className="text-lg font-bold">
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              `${balance.toFixed(2)} USDC`
            )}
          </span>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Error: {error}
          </div>
        )}

        <button
          onClick={refreshBalance}
          disabled={loading}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Actualizando...' : 'Actualizar Balance'}
        </button>
      </div>

      {!userAddress && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
          ⚠️ No se proporcionó dirección de usuario. Usando balance simulado.
        </div>
      )}
    </div>
  );
} 
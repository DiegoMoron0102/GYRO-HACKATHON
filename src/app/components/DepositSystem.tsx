"use client";

import React, { useState, useEffect } from 'react';
import { useDeposit } from '../../hooks/useDeposit';
import { ADMIN_CONFIG } from '../../lib/adminConfig';

// Interface for payment record
interface PaymentRecord {
  created_at: string;
  amount: string;
  transaction_hash?: string;
}

export default function DepositSystem() {
  const [userPublicKey, setUserPublicKey] = useState('');
  const [userSecretKey, setUserSecretKey] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [step, setStep] = useState<'check' | 'create' | 'trustline' | 'deposit'>('check');
  
  const {
    loading,
    error,
    success,
    userAccountInfo,
    adminBalance,
    depositHistory,
    checkUserAccount,
    createUserAccount,
    establishTrustline,
    processDeposit,
    getDepositHistory,
    getAdminBalance,
    resetState,
  } = useDeposit();

  // Cargar balance admin al montar el componente
  useEffect(() => {
    getAdminBalance();
  }, [getAdminBalance]);

  const handleCheckAccount = async () => {
    if (!userPublicKey.trim()) {
      alert('Por favor ingresa la public key del usuario');
      return;
    }
    
    await checkUserAccount(userPublicKey.trim());
    if (success) {
      setStep('create');
    }
  };

  const handleCreateAccount = async () => {
    if (!userPublicKey.trim()) {
      alert('Por favor ingresa la public key del usuario');
      return;
    }
    
    await createUserAccount(userPublicKey.trim());
    if (success) {
      setStep('trustline');
    }
  };

  const handleEstablishTrustline = async () => {
    if (!userSecretKey.trim()) {
      alert('Por favor ingresa la secret key del usuario');
      return;
    }
    
    await establishTrustline(userSecretKey.trim());
    if (success) {
      setStep('deposit');
    }
  };

  const handleProcessDeposit = async () => {
    if (!userPublicKey.trim() || !depositAmount.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    
    await processDeposit({
      userPublicKey: userPublicKey.trim(),
      amount,
      description: 'Depósito automático'
    });
    
    if (success) {
      // Cargar historial después del depósito exitoso
      await getDepositHistory(userPublicKey.trim());
    }
  };

  const resetForm = () => {
    setUserPublicKey('');
    setUserSecretKey('');
    setDepositAmount('');
    setStep('check');
    resetState();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema de Depósitos USDC</h1>
        <p className="text-gray-600">Sistema automatizado para depósitos en Stellar testnet</p>
      </div>

      {/* Balance Admin */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">💰 Balance de la Cuenta Admin</h2>
        {adminBalance ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{parseFloat(adminBalance.usdc).toLocaleString()}</div>
              <div className="text-sm text-blue-500">USDC Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{parseFloat(adminBalance.xlm).toLocaleString()}</div>
              <div className="text-sm text-blue-500">XLM Disponible</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-blue-600">Cargando balance...</div>
        )}
      </div>

      {/* Paso 1: Verificar Cuenta */}
      {step === 'check' && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Paso 1: Verificar Cuenta de Usuario</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key del Usuario
              </label>
              <input
                type="text"
                value={userPublicKey}
                onChange={(e) => setUserPublicKey(e.target.value)}
                placeholder="G... (Stellar public key)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCheckAccount}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar Cuenta'}
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Crear Cuenta */}
      {step === 'create' && (
        <div className="mb-6 p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-4">🏗️ Paso 2: Crear Cuenta de Usuario</h2>
          {userAccountInfo ? (
            <div className="mb-4 p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Información de la Cuenta:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estado:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    userAccountInfo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {userAccountInfo.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Trustline USDC:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    userAccountInfo.hasTrustline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userAccountInfo.hasTrustline ? 'Establecido' : 'No establecido'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Balance XLM:</span>
                  <span className="ml-2">{userAccountInfo.xlmBalance}</span>
                </div>
                <div>
                  <span className="font-medium">Balance USDC:</span>
                  <span className="ml-2">{userAccountInfo.usdcBalance}</span>
                </div>
              </div>
            </div>
          ) : null}
          
          {!userAccountInfo?.isActive && (
            <div className="space-y-4">
              <p className="text-green-700">La cuenta no existe. Vamos a crearla con 2 XLM inicial.</p>
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </div>
          )}
          
          {userAccountInfo?.isActive && (
            <div className="space-y-4">
              <p className="text-green-700">✅ La cuenta ya existe y está activa.</p>
              <button
                onClick={() => setStep('trustline')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Continuar al Siguiente Paso
              </button>
            </div>
          )}
        </div>
      )}

      {/* Paso 3: Establecer Trustline */}
      {step === 'trustline' && (
        <div className="mb-6 p-6 bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">🔗 Paso 3: Establecer Trustline para USDC</h2>
          <div className="space-y-4">
            <p className="text-yellow-700">
              Para recibir USDC, el usuario debe establecer un trustline. 
              Esto requiere la secret key del usuario.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key del Usuario
              </label>
              <input
                type="password"
                value={userSecretKey}
                onChange={(e) => setUserSecretKey(e.target.value)}
                placeholder="S... (Stellar secret key)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button
              onClick={handleEstablishTrustline}
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
            >
              {loading ? 'Estableciendo trustline...' : 'Establecer Trustline'}
            </button>
          </div>
        </div>
      )}

      {/* Paso 4: Procesar Depósito */}
      {step === 'deposit' && (
        <div className="mb-6 p-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">💰 Paso 4: Procesar Depósito USDC</h2>
          <div className="space-y-4">
            <p className="text-purple-700">
              ¡Perfecto! Ahora puedes procesar el depósito de USDC para el usuario.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad USDC a Depositar
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="100"
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleProcessDeposit}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Procesando depósito...' : 'Procesar Depósito'}
            </button>
          </div>
        </div>
      )}

      {/* Mensajes de Estado */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">¡Éxito!</h3>
              <div className="mt-2 text-sm text-green-700">Operación completada correctamente.</div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Depósitos */}
      {depositHistory.length > 0 && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Historial de Depósitos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {depositHistory.map((payment, index) => {
                  const paymentRecord = payment as PaymentRecord;
                  return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(paymentRecord.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paymentRecord.amount} USDC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paymentRecord.transaction_hash?.substring(0, 8)}...
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Botones de Control */}
      <div className="flex space-x-4">
        <button
          onClick={resetForm}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Reiniciar Sistema
        </button>
        
        {userPublicKey && (
          <button
            onClick={() => getDepositHistory(userPublicKey)}
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Ver Historial'}
          </button>
        )}
      </div>

      {/* Información del Sistema */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">ℹ️ Información del Sistema</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Red:</strong> Stellar Testnet</p>
          <p><strong>Asset:</strong> USDC Personalizado</p>
          <p><strong>Issuer:</strong> {ADMIN_CONFIG.USDC_ISSUER}</p>
          <p><strong>Cuenta Admin:</strong> {ADMIN_CONFIG.PUBLIC_KEY}</p>
        </div>
      </div>
    </div>
  );
} 
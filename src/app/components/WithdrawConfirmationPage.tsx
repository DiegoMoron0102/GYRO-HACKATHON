"use client";

import React, { useState } from "react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useContractBalance } from "@/hooks/useContractBalance";
import { useWithdraw } from "@/hooks/useWithdraw";
import { ADMIN_CONFIG } from "@/lib/adminConfig";

interface WithdrawConfirmationPageProps {
  onBack?: () => void;
  onConfirmWithdraw?: (amount: number) => void;
  selectedAccount?: {
    id: string;
    type: 'bank' | 'crypto';
    name: string;
    details: string;
  };
  userAddress?: string;
}

export default function WithdrawConfirmationPage({
  onBack,
  onConfirmWithdraw,
  selectedAccount,
  userAddress
}: WithdrawConfirmationPageProps) {
  const [amount, setAmount] = useState<number>(0);
  const { sellRate } = useExchangeRate();

  // Hook para obtener el balance real del contrato
  const { 
    balance: contractBalance, 
    loading: balanceLoading, 
    refreshBalance 
  } = useContractBalance({ 
    userAddress: userAddress || '',
    assetType: "USDC"
  });

  // Hook de retiro real
  const { withdraw, isLoading, error } = useWithdraw({
    userAddress: userAddress || "",
    onWithdrawSuccess: () => {
      console.log('✅ Retiro exitoso, actualizando balance...');
      refreshBalance();
    }
  });

  // Conversión: USDC del contrato a BOB para mostrar al usuario
  const availableBalanceBOB = contractBalance ? Math.floor(contractBalance / ADMIN_CONFIG.EXCHANGE_RATE) : 0;

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setAmount(numericValue);
  };

  const handleConfirm = async () => {
    if (isValidAmount() && onConfirmWithdraw) {
      try {
        console.log('🚀 Iniciando retiro real de', amount, 'BOB');
        
        // Procesar el retiro usando el hook de smart contract
        await withdraw(amount);
        
        console.log('✅ Retiro completado exitosamente');
        
        // Llamar al callback original para continuar el flujo
        onConfirmWithdraw(amount);
      } catch (err) {
        console.error('❌ Error al procesar retiro:', err);
        alert(`Error al procesar el retiro: ${err}`);
      }
    }
  };

  const isValidAmount = () => {
    return amount > 0 && amount <= availableBalanceBOB && !balanceLoading;
  };

  if (!selectedAccount) {
    return (
      <div className="withdraw-confirmation-full-screen">
        <main className="withdraw-confirmation-main">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No se ha seleccionado una cuenta</p>
          </div>
        </main>
      </div>
    );
  }

  const convertedAmount =
    selectedAccount.type === "bank"
      ? (amount * sellRate).toFixed(2)
      : amount.toFixed(2);

  const convertedCurrency = selectedAccount.type === "bank" ? "BOB" : "USDT";

  return (
    <div className="withdraw-confirmation-full-screen">
      <main className="withdraw-confirmation-main">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#1C2317"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Retirar</h1>
          <div className="w-10"></div>
        </header>

        <section className="flex-1 bg-white p-4">
          <div className="space-y-6">
            {/* FROM */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Desde</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#1C2317]">USDC</p>
                      <p className="text-sm text-gray-500">
                        Disponible: {balanceLoading ? "Cargando..." : `${availableBalanceBOB.toFixed(2)} BOB`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TO */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Hacia</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    {selectedAccount.type === "bank" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#1C2317]">{selectedAccount.name}</p>
                    <p className="text-sm text-gray-500">{selectedAccount.details}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AMOUNT */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Cantidad</p>
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 text-2xl font-bold bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-[#2A906F] transition-all"
                min="0"
                max={availableBalanceBOB}
                step="0.01"
              />
            </div>

            {/* RECEIVED */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Recibirás</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-[#1C2317]">{convertedAmount} {convertedCurrency}</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={handleConfirm}
              disabled={!isValidAmount() || isLoading}
              className={`w-full py-4 rounded-2xl font-semibold transition-colors shadow-lg ${
                isValidAmount() && !isLoading
                  ? 'bg-[#2A906F] text-white hover:bg-[#1F6B52]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Procesando retiro...' : 'Retirar'}
            </button>
            
            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div>Debug: Amount={amount}, Valid={isValidAmount().toString()}</div>
              <div>AvailableBOB={availableBalanceBOB}, Loading={balanceLoading.toString()}</div>
              <div>UserAddress={userAddress?.slice(0,8)}..., ContractBalance={contractBalance}</div>
            </div>
            
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">❌ Error: {error}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .withdraw-confirmation-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .withdraw-confirmation-main {
          height: 100vh;
          max-width: 390px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          background: white;
        }
      `}</style>
    </div>
  );
}

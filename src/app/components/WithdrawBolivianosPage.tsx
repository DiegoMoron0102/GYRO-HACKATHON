"use client";

import React, { useState } from "react";
import { useWithdraw } from "../../hooks/useWithdraw";
import { useContractBalance } from "../../hooks/useContractBalance";
import { ADMIN_CONFIG } from "../../lib/adminConfig";

interface WithdrawBolivianosPageProps {
  onBack?: () => void;
  onAddAccount?: () => void;
  userAddress?: string;
  onRefreshBalance?: () => void;
}



export default function WithdrawBolivianosPage({ onBack, onAddAccount, userAddress, onRefreshBalance }: WithdrawBolivianosPageProps) {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  
  // Debug: Verificar que tenemos userAddress
  console.log("🔍 WithdrawBolivianosPage - userAddress:", userAddress);
  
  // Hook para obtener el balance real del contrato
  const { 
    balance: contractBalance, 
    loading: balanceLoading, 
    refreshBalance 
  } = useContractBalance({ 
    userAddress: userAddress || '',
    assetType: "USDC"
  });

  // Debug: Verificar balance
  console.log("💰 WithdrawBolivianosPage - contractBalance:", contractBalance, "loading:", balanceLoading);

  // Hook de retiro actualizado
  const { withdraw, isLoading, error } = useWithdraw({
    userAddress: userAddress || "",
    onWithdrawSuccess: () => {
      console.log('✅ Retiro exitoso, actualizando balance...');
      refreshBalance();
      onRefreshBalance?.();
    }
  });
  
  // Conversión: USDC del contrato a BOB para mostrar al usuario
  const availableBalanceBOB = contractBalance ? Math.floor(contractBalance / ADMIN_CONFIG.EXCHANGE_RATE) : 0;
  const minAmount = 1; // Mínimo 1 BOB
  const maxAmount = availableBalanceBOB; // Máximo el balance disponible
  
  const bankAccounts = [
    { id: "banco_union_123", name: "Cuenta de Ahorros", number: "**** 1234", bank: "Banco Unión" },
    { id: "bnb_456", name: "Cuenta Corriente", number: "**** 5678", bank: "Banco Nacional de Bolivia" },
    { id: "bcp_789", name: "Cuenta de Ahorros", number: "**** 9012", bank: "Banco de Crédito" },
  ];

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue.split('.').length <= 2) {
      setAmount(numericValue);
    }
  };

  const handleConfirm = async () => {
    const numericAmount = parseFloat(amount);
    if (isValidAmount()) {
      try {
        console.log('🚀 Iniciando retiro de', numericAmount, 'BOB');
        await withdraw(numericAmount);
        console.log('✅ Retiro completado exitosamente');
      } catch (err) {
        console.error('❌ Error en retiro:', err);
      }
    }
  };

  const isValidAmount = () => {
    const numericAmount = parseFloat(amount);
    const isValid = numericAmount > 0 && 
           numericAmount >= minAmount && 
           numericAmount <= maxAmount && 
           selectedAccount.length > 0 &&
           !balanceLoading; // También verificar que no esté cargando
    
    // Debug: Verificar validación
    console.log("🔍 isValidAmount check:", {
      numericAmount,
      minAmount,
      maxAmount,
      selectedAccount,
      balanceLoading,
      availableBalanceBOB,
      isValid
    });
    
    return isValid;
  };

  return (
    <div className="withdraw-bolivianos-full-screen">
      <main className="withdraw-bolivianos-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Retirar</h1>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#1C2317" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        {/* Content */}
        <section className="flex-1 bg-gray-50 p-4 space-y-6">
          {/* Add new account prompt */}
          <div className="text-center py-6">
            <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Agregar una nueva cuenta para retiros</h2>
            <p className="text-gray-600 text-sm mb-6">Los retiros solo se pueden realizar a cuentas personales</p>
            
            <button 
              onClick={onAddAccount}
              className="w-full bg-white border border-gray-200 py-4 rounded-2xl font-medium text-[#1C2317] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="#1C2317" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Agregar cuenta
            </button>

            <button className="w-full bg-white border border-gray-200 py-4 rounded-2xl font-medium text-[#1C2317] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 7h14l-1-4H4l-1 4z" stroke="#1C2317" strokeWidth="1.5"/>
                <path d="M3 7v8a2 2 0 002 2h10a2 2 0 002-2V7" stroke="#1C2317" strokeWidth="1.5"/>
                <path d="M8 12h4" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Escanear código QR
            </button>
          </div>

          {/* Existing accounts section */}
          {bankAccounts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#1C2317] mb-4">Cuentas existentes</h3>
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <button 
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`w-full bg-white border-2 p-4 rounded-2xl text-left transition-colors ${
                      selectedAccount === account.id 
                        ? 'border-[#2A906F] bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M3 7h14l-1-4H4l-1 4z" stroke="#1C2317" strokeWidth="1.5"/>
                          <path d="M3 7v8a2 2 0 002 2h10a2 2 0 002-2V7" stroke="#1C2317" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2317]">{account.name}</p>
                        <p className="text-sm text-gray-500">{account.number}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount section - only show if account is selected */}
          {selectedAccount && (
            <div className="bg-white rounded-2xl p-4 space-y-4">
              
              {/* Source Account Info */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-600 mb-2">Desde</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" fill="#2A906F"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C2317]">USDC</p>
                    <p className="text-sm text-gray-500">
                      Disponible: {balanceLoading ? "Cargando..." : `${availableBalanceBOB.toFixed(2)} BOB`}
                    </p>
                    {/* Debug info visible */}
                    <p className="text-xs text-blue-500">
                      Debug: Balance={contractBalance} USDC, User={userAddress?.slice(0,8)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Destination Account Info */}
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-600 mb-2">Hacia</p>
                {(() => {
                  const selectedBankAccount = bankAccounts.find(acc => acc.id === selectedAccount);
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="4" width="12" height="8" rx="2" fill="#3B82F6"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2317]">{selectedBankAccount?.name}</p>
                        <p className="text-sm text-gray-500">{selectedBankAccount?.bank}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-lg font-semibold text-[#1C2317] block mb-2">Cantidad</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl font-semibold text-[#1C2317] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-gray-100 pt-4">
                <span className="text-gray-600">Recibirás</span>
                <span className="text-lg font-semibold text-[#1C2317]">
                  {amount || "0"} BOB
                </span>
              </div>
              
              {contractBalance > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Balance después del retiro</span>
                  <span className="text-lg font-semibold text-[#2A906F]">
                    {amount ? `${Math.max(0, availableBalanceBOB - parseFloat(amount)).toFixed(2)} BOB` : `${availableBalanceBOB.toFixed(2)} BOB`}
                  </span>
                </div>
              )}
              
              {contractBalance === 0 && !balanceLoading && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <p className="text-yellow-700 text-sm">⚠️ No tienes balance disponible para retirar</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer with Continue Button */}
        {selectedAccount && (
          <footer className="p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleConfirm}
              disabled={!isValidAmount() || isLoading}
              className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
                isValidAmount() && !isLoading
                  ? 'bg-[#2A906F] text-white hover:bg-[#1F6B52] shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Procesando...' : 'Retirar'}
            </button>
            
            {/* Debug info for button state */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div>Debug: Amount={amount}, Valid={isValidAmount().toString()}</div>
              <div>Min={minAmount}, Max={maxAmount}, Loading={balanceLoading.toString()}</div>
              <div>Selected={selectedAccount}, ContractBalance={contractBalance}</div>
            </div>
            
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">❌ Error: {error}</p>
              </div>
            )}
          </footer>
        )}
      </main>

      <style jsx>{`
        .withdraw-bolivianos-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f9fafb;
          z-index: 50;
        }

        .withdraw-bolivianos-main {
          height: 100vh;
          max-width: 390px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}

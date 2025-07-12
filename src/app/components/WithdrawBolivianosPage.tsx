"use client";

import React, { useState } from "react";

interface WithdrawBolivianosPageProps {
  onBack?: () => void;
  onConfirmWithdraw?: (amount: number, bankAccount: string) => void;
  onAddAccount?: () => void;
}

export default function WithdrawBolivianosPage({ onBack, onConfirmWithdraw, onAddAccount }: WithdrawBolivianosPageProps) {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  
  // Exchange rate (this could come from an API)
  const exchangeRate = 16.03; // 1 USD = 16.03 BOB for withdrawal
  const minAmount = 50; // Minimum withdrawal in Bolivianos
  const maxAmount = 50000; // Maximum withdrawal in Bolivianos
  
  const bankAccounts = [
    { id: "1", name: "Checking", number: "**** 1234", bank: "Banco Nacional" },
    { id: "2", name: "Savings", number: "**** 5678", bank: "Banco Sol" },
  ];

  // Calculate BOB amount based on USDT input
  const calculateBOB = (usdtAmount: number) => {
    return (usdtAmount * exchangeRate).toFixed(2);
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue.split('.').length <= 2) {
      setAmount(numericValue);
    }
  };

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isValidAmount() && onConfirmWithdraw) {
      onConfirmWithdraw(numericAmount, selectedAccount);
    }
  };

  const isValidAmount = () => {
    const numericAmount = parseFloat(amount);
    const bobAmount = numericAmount * exchangeRate;
    return numericAmount > 0 && bobAmount >= minAmount && bobAmount <= maxAmount && selectedAccount.length > 0;
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
              <div>
                <label className="text-lg font-semibold text-[#1C2317] block mb-2">Amount (USDT)</label>
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

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Recibirás</span>
                <span className="text-lg font-semibold text-[#1C2317]">
                  {amount ? calculateBOB(parseFloat(amount) || 0) : "0.00"} BOB
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Footer with Continue Button */}
        {selectedAccount && (
          <footer className="p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleConfirm}
              disabled={!isValidAmount()}
              className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
                isValidAmount()
                  ? 'bg-[#2A906F] text-white hover:bg-[#1F6B52] shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
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

"use client";

import React, { useState } from "react";

interface WithdrawConfirmationPageProps {
  onBack?: () => void;
  onConfirmWithdraw?: (amount: number) => void;
  selectedAccount?: {
    id: string;
    type: 'bank' | 'crypto';
    name: string;
    details: string;
  };
}

export default function WithdrawConfirmationPage({ onBack, onConfirmWithdraw, selectedAccount }: WithdrawConfirmationPageProps) {
  const [amount, setAmount] = useState("");
  
  // Exchange rate for withdrawal
  const exchangeRate = 16.03; // 1 USDT = 16.03 BOB
  
  // Available balance (this would come from user data)
  const availableBalance = 1200; // USDT

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue.split('.').length <= 2) {
      setAmount(numericValue);
    }
  };

  const calculateBOB = (usdtAmount: number) => {
    return (usdtAmount * exchangeRate).toFixed(2);
  };

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0 && numericAmount <= availableBalance && onConfirmWithdraw) {
      onConfirmWithdraw(numericAmount);
    }
  };

  const isValidAmount = () => {
    const numericAmount = parseFloat(amount);
    return numericAmount > 0 && numericAmount <= availableBalance;
  };

  return (
    <div className="withdraw-confirmation-full-screen">
      <main className="withdraw-confirmation-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Retirar</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4 space-y-6">
          {/* From Section */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Desde</p>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#1C2317" strokeWidth="1.5"/>
                  <text x="10" y="14" textAnchor="middle" fontSize="6" fill="#1C2317" fontWeight="bold">USDT</text>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#1C2317]">USDT</p>
                <p className="text-sm text-gray-500">Disponible: {availableBalance} USDT</p>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Hacia</p>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 7h14l-1-4H4l-1 4z" stroke="#1C2317" strokeWidth="1.5"/>
                  <path d="M3 7v8a2 2 0 002 2h10a2 2 0 002-2V7" stroke="#1C2317" strokeWidth="1.5"/>
                  <path d="M8 12h4" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#1C2317]">BOB</p>
                <p className="text-sm text-gray-500">
                  {selectedAccount ? `${selectedAccount.name} - ${selectedAccount.details}` : 'Cuenta bancaria terminada en 1234'}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Cantidad</p>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="text-2xl font-semibold text-[#1C2317] bg-transparent outline-none flex-1"
                />
                <span className="text-lg font-medium text-gray-500 ml-2">USDT</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">= {amount ? calculateBOB(parseFloat(amount) || 0) : "0.00"} BOB</p>
            </div>
          </div>

          {/* You'll receive Section */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Recibirás</p>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xl font-semibold text-[#1C2317]">
                {amount ? calculateBOB(parseFloat(amount) || 0) : "0.00"} BOB
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
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
            Retirar
          </button>
        </footer>
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

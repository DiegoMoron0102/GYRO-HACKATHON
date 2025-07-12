"use client";

import React, { useState } from "react";

interface DepositBolivianosPageProps {
  onBack?: () => void;
  onConfirmDeposit?: (amount: number, reference: string) => void;
}

export default function DepositBolivianosPage({ onBack, onConfirmDeposit }: DepositBolivianosPageProps) {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  
  // Exchange rate (this could come from an API)
  const exchangeRate = 16.55; // 1 USD = 6.96 BOB
  const maxAmount = 160000; // Maximum allowed in Bolivianos
  
  // Calculate USDT amount based on BOB input
  const calculateUSDT = (bobAmount: number) => {
    return (bobAmount / exchangeRate).toFixed(2);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue.split('.').length <= 2) {
      setAmount(numericValue);
    }
  };

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0 && numericAmount <= maxAmount && onConfirmDeposit) {
      onConfirmDeposit(numericAmount, reference);
    }
  };

  const isValidAmount = () => {
    const numericAmount = parseFloat(amount);
    return numericAmount > 0 && numericAmount <= maxAmount;
  };

  return (
    <div className="deposit-bolivianos-full-screen">
      <main className="deposit-bolivianos-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Deposit in Bolivianos</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-[#1C2317]">Amount</label>
            <div className="bg-gray-100 rounded-xl p-4">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-xl font-medium text-[#1C2317] outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="flex justify-between items-center py-4">
            <span className="text-[#698282] font-medium">Exchange rate</span>
            <span className="text-[#1C2317] font-medium">1 USD = {exchangeRate} BOB</span>
          </div>

          {/* You will receive */}
          <div className="flex justify-between items-center py-4">
            <span className="text-[#698282] font-medium">You will receive</span>
            <span className="text-[#1C2317] font-medium">
              {amount ? calculateUSDT(parseFloat(amount) || 0) : "0.00"} USDT
            </span>
          </div>

          {/* Reference Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-[#1C2317]">Reference</label>
            <div className="bg-gray-100 rounded-xl p-4">
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Optional"
                className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-[#698282]"
                maxLength={50}
              />
            </div>
          </div>

          {/* Maximum allowed info */}
          <div className="pt-2">
            <p className="text-[#698282] text-sm">
              Maximum allowed: {maxAmount.toLocaleString()} Bolivianos
            </p>
          </div>
        </section>

        {/* Footer with Confirm Button */}
        <footer className="p-4 bg-white">
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount()}
            className={`w-full py-3 rounded-3xl font-medium transition-colors ${
              isValidAmount()
                ? 'bg-[#2A906F] text-white hover:bg-[#1F6B52]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Deposit
          </button>
        </footer>
      </main>

      <style jsx>{`
        .deposit-bolivianos-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .deposit-bolivianos-main {
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

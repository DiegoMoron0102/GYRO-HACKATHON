"use client";

import React, { useState } from "react";

interface WithdrawBolivianosPageProps {
  onBack?: () => void;
  onConfirmWithdraw?: (amount: number, bankAccount: string) => void;
}

export default function WithdrawBolivianosPage({ onBack, onConfirmWithdraw }: WithdrawBolivianosPageProps) {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  
  // Exchange rate (this could come from an API)
  const exchangeRate = 16.03; // 1 USD = 16.03 BOB for withdrawal
  const minAmount = 50; // Minimum withdrawal in Bolivianos
  const maxAmount = 50000; // Maximum withdrawal in Bolivianos
  
  // Calculate BOB amount based on USDT input
  const calculateBOB = (usdtAmount: number) => {
    return (usdtAmount * exchangeRate).toFixed(2);
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
    if (isValidAmount() && onConfirmWithdraw) {
      onConfirmWithdraw(numericAmount, bankAccount);
    }
  };

  const isValidAmount = () => {
    const numericAmount = parseFloat(amount);
    const bobAmount = numericAmount * exchangeRate;
    return numericAmount > 0 && bobAmount >= minAmount && bobAmount <= maxAmount && bankAccount.length > 0;
  };

  return (
    <div className="withdraw-bolivianos-full-screen">
      <main className="withdraw-bolivianos-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Withdraw in Bolivianos</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-[#1C2317]">Amount (USDT)</label>
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
              {amount ? calculateBOB(parseFloat(amount) || 0) : "0.00"} BOB
            </span>
          </div>

          {/* Bank Account Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-[#1C2317]">Bank Account</label>
            <div className="bg-gray-100 rounded-xl p-4">
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Enter your bank account number"
                className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-[#698282]"
                maxLength={20}
              />
            </div>
          </div>

          {/* Limits info */}
          <div className="pt-2">
            <p className="text-[#698282] text-sm">
              Minimum: {minAmount} BOB • Maximum: {maxAmount.toLocaleString()} BOB
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
            Confirm Withdrawal
          </button>
        </footer>
      </main>

      <style jsx>{`
        .withdraw-bolivianos-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .withdraw-bolivianos-main {
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

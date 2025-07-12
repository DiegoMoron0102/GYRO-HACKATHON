"use client";

import React, { useState } from "react";

interface DepositCryptoPageProps {
  onBack?: () => void;
  onConfirmDeposit?: (cryptocurrency: string, amount: number) => void;
}

const cryptocurrencies = [
  { symbol: "USDT", name: "Tether", rate: 1.00 },
  { symbol: "USDC", name: "Circle", rate: 1.00 },
  
];

export default function DepositCryptoPage({ onBack, onConfirmDeposit }: DepositCryptoPageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Calculate USDT equivalent
  const calculateUSDT = (cryptoAmount: number, cryptoSymbol: string) => {
    const crypto = cryptocurrencies.find(c => c.symbol === cryptoSymbol);
    if (!crypto) return "0.00";
    return (cryptoAmount * crypto.rate).toFixed(2);
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
    if (numericAmount > 0 && onConfirmDeposit) {
      onConfirmDeposit(selectedCrypto, numericAmount);
    }
  };

  const isValidAmount = () => {
    const numericAmount = parseFloat(amount);
    return numericAmount > 0;
  };


  return (
    <div className="deposit-crypto-full-screen">
      <main className="deposit-crypto-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Depositar en criptomoneda</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4 space-y-6">
          {/* Cryptocurrency Selector */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-[#1C2317]">Criptomoneda</label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-gray-100 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2A906F] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{selectedCrypto.slice(0, 2)}</span>
                  </div>
                  <span className="text-[#1C2317] font-medium">{selectedCrypto}</span>
                </div>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  className={`text-[#698282] transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {cryptocurrencies.map((crypto) => (
                    <button
                      key={crypto.symbol}
                      onClick={() => {
                        setSelectedCrypto(crypto.symbol);
                        setShowDropdown(false);
                      }}
                      className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="w-8 h-8 bg-[#2A906F] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{crypto.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-[#1C2317] font-medium">{crypto.symbol}</p>
                        <p className="text-[#698282] text-sm">{crypto.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-[#1C2317]">Cantidad</label>
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

          {/* You will receive */}
          <div className="flex justify-between items-center py-4">
            <span className="text-[#698282] font-medium">Recibirás</span>
            <span className="text-[#1C2317] font-medium">
              {amount ? calculateUSDT(parseFloat(amount) || 0, selectedCrypto) : "0.00"} USDT
            </span>
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
            Confirmar depósito
          </button>
        </footer>
      </main>

      <style jsx>{`
        .deposit-crypto-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .deposit-crypto-main {
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

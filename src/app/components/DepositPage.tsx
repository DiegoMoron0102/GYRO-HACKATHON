"use client";

import React from "react";

interface DepositPageProps {
  onBack?: () => void;
  onDepositBolivianos?: () => void;
  onDepositCrypto?: () => void;
}

export default function DepositPage({ onBack, onDepositBolivianos, onDepositCrypto }: DepositPageProps) {
  return (
    <div className="deposit-full-screen">
      <main className="deposit-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Depositar</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white">
          {/* Deposit in Bolivianos Section */}
          <div className="px-4 py-6">
            {/* Option Item */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#1C2317]">Depositar en Bolivianos</h3>
              </div>
            </div>

            {/* Deposit Button for Bolivianos */}
            <button 
              onClick={onDepositBolivianos}
              className="w-full bg-[#2A906F] text-white py-3 rounded-3xl font-medium hover:bg-[#1F6B52] transition-colors mb-12"
            >
              Depositar
            </button>
          </div>

          {/* Separator */}
          <div className="h-1.5 bg-gray-50"></div>

          {/* Deposit in Cryptocurrencies Section */}
          <div className="px-4 py-6">
            {/* Option Item */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#1C2317" strokeWidth="1.5"/>
                  <path d="M9.09 9A3 3 0 0 1 15 9" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 12H16" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 8V16" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#1C2317]">Depositar en Criptomonedas</h3>
              </div>
            </div>

            {/* Deposit Button for Crypto */}
            <button 
              onClick={onDepositCrypto}
              className="w-full bg-[#2A906F] text-white py-3 rounded-3xl font-medium hover:bg-[#1F6B52] transition-colors"
            >
              Depositar
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        .deposit-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .deposit-main {
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

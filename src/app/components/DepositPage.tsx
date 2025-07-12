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
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Depositar</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4">
          <div className="space-y-4">
            <div className="text-center py-6">
              <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Elige tu método de depósito</h2>
              <p className="text-gray-600 text-sm">Selecciona cómo quieres agregar fondos</p>
            </div>

            {/* Deposit in Bolivianos */}
            <button
              onClick={onDepositBolivianos}
              className="w-full p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#2A906F] hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#1C2317]">Depositar en bolivianos</h3>
                  <p className="text-sm text-gray-500">Transferencia bancaria en BOB</p>
                </div>
              </div>
            </button>

            {/* Deposit in Crypto */}
            <button
              onClick={onDepositCrypto}
              className="w-full p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#2A906F] hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#1C2317]">Depositar en criptomoneda</h3>
                  <p className="text-sm text-gray-500">USDT o USDC</p>
                </div>
              </div>
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
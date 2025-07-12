"use client";

import React from "react";

interface AccountTypeSelectionPageProps {
  onBack?: () => void;
  onSelectBolivianos?: () => void;
  onSelectCrypto?: () => void;
}

export default function AccountTypeSelectionPage({ onBack, onSelectBolivianos, onSelectCrypto }: AccountTypeSelectionPageProps) {
  return (
    <div className="account-type-full-screen">
      <main className="account-type-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Seleccionar tipo de cuenta</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4">
          <div className="space-y-4">
            <div className="text-center py-6">
              <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Elegir tipo de cuenta</h2>
              <p className="text-gray-600 text-sm">Selecciona dónde quieres recibir tus retiros</p>
            </div>

            {/* Bank Account Option */}
            <button 
              onClick={onSelectBolivianos}
              className="w-full bg-white border border-gray-200 py-6 px-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9h18l-2-6H5l-2 6z" stroke="#1C2317" strokeWidth="1.5"/>
                    <path d="M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9" stroke="#1C2317" strokeWidth="1.5"/>
                    <path d="M9 15h6" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-[#1C2317]">Cuenta bancaria</h3>
                  <p className="text-sm text-gray-500">Retirar a bolivianos (BOB)</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 14l3-3-3-3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Crypto Wallet Option */}
            <button 
              onClick={onSelectCrypto}
              className="w-full bg-white border border-gray-200 py-6 px-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#1C2317" strokeWidth="1.5"/>
                    <path d="M8 12h8M12 8v8" stroke="#1C2317" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-[#1C2317]">Wallet cripto</h3>
                  <p className="text-sm text-gray-500">Retirar a criptomoneda</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 14l3-3-3-3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        .account-type-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .account-type-main {
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

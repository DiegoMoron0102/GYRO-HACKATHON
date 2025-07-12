"use client";

import React from "react";

interface SavedAccount {
  id: string;
  type: 'bank' | 'crypto';
  name: string;
  details: string;
  bank?: string;
}

interface WithdrawPageProps {
  onBack?: () => void;
  onSelectAccount?: (account: SavedAccount) => void;
  onAddAccount?: () => void;
  onScanQR?: () => void;
}

export default function WithdrawPage({ onBack, onSelectAccount, onAddAccount, onScanQR }: WithdrawPageProps) {
  // Mock saved accounts - in real app this would come from props or state management
  const savedAccounts: SavedAccount[] = [
    {
      id: "1",
      type: "bank",
      name: "Checking",
      details: "Chase Bank",
      bank: "Chase Bank"
    }
  ];

  return (
    <div className="withdraw-full-screen">
      <main className="withdraw-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Retirar</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4">
          {/* Add new account section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Agregar una nueva cuenta para retiros</h2>
            <p className="text-gray-600 text-sm mb-6">Los retiros solo se pueden realizar a cuentas personales</p>
            
            <div className="space-y-3">
              <button 
                onClick={onAddAccount}
                className="w-full bg-white border border-gray-200 py-4 px-4 rounded-2xl font-medium text-[#1C2317] hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="#1C2317" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-left">Agregar cuenta</span>
              </button>

              <button 
                onClick={onScanQR}
                className="w-full bg-white border border-gray-200 py-4 px-4 rounded-2xl font-medium text-[#1C2317] hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 7h2V5a2 2 0 012-2h2m0 14h2a2 2 0 002-2v-2m0-8h2v2a2 2 0 01-2 2h-2M7 3H5a2 2 0 00-2 2v2m0 8v2a2 2 0 002 2h2" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="10" r="1.5" fill="#1C2317"/>
                  </svg>
                </div>
                <span className="text-left">Escanear código QR</span>
              </button>
            </div>
          </div>

          {/* Existing accounts section */}
          {savedAccounts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#1C2317] mb-4">Cuentas existentes</h3>
              <div className="space-y-3">
                {savedAccounts.map((account) => (
                  <button 
                    key={account.id}
                    onClick={() => onSelectAccount?.(account)}
                    className="w-full bg-white border border-gray-200 py-4 px-4 rounded-2xl text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        {account.type === 'bank' ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 7h14l-1-4H4l-1 4z" stroke="#1C2317" strokeWidth="1.5"/>
                            <path d="M3 7v8a2 2 0 002 2h10a2 2 0 002-2V7" stroke="#1C2317" strokeWidth="1.5"/>
                            <path d="M8 12h4" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" stroke="#1C2317" strokeWidth="1.5"/>
                            <path d="M8 10h4M10 8v4" stroke="#1C2317" strokeWidth="1.5"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1C2317]">{account.name}</p>
                        <p className="text-sm text-gray-500">{account.details}</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7 14l3-3-3-3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Footer with Continue Button */}
        {savedAccounts.length > 0 && (
          <footer className="p-4 bg-white border-t border-gray-100">
            <button
              disabled={savedAccounts.length === 0}
              className="w-full py-4 rounded-2xl font-semibold bg-[#2A906F] text-white hover:bg-[#1F6B52] transition-colors shadow-lg"
            >
              Continuar
            </button>
          </footer>
        )}
      </main>

      <style jsx>{`
        .withdraw-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .withdraw-main {
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

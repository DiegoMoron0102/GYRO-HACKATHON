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
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Agregar una nueva cuenta para retiros</h2>
              <p className="text-gray-600 text-sm">Los retiros solo se pueden realizar a cuentas personales</p>
            </div>

            {/* Add Account Options */}
            <div className="space-y-4">
              <button
                onClick={onAddAccount}
                className="w-full flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <path d="M12 5v14m-7-7h14"/>
                  </svg>
                </div>
                <span className="text-left font-medium text-[#1C2317]">Agregar cuenta</span>
              </button>

              <button
                onClick={onScanQR}
                className="w-full flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <rect x="3" y="3" width="5" height="5"/>
                    <rect x="16" y="3" width="5" height="5"/>
                    <rect x="3" y="16" width="5" height="5"/>
                    <rect x="16" y="16" width="5" height="5"/>
                    <rect x="9" y="9" width="6" height="6"/>
                  </svg>
                </div>
                <span className="text-left font-medium text-[#1C2317]">Escanear código QR</span>
              </button>
            </div>

            {/* Existing Accounts */}
            <div>
              <h3 className="text-lg font-semibold text-[#1C2317] mb-4">Cuentas existentes</h3>
              
              {savedAccounts.length > 0 ? (
                <div className="space-y-3">
                  {savedAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => onSelectAccount?.(account)}
                      className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#2A906F] hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {account.type === 'bank' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                              <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                              <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-[#1C2317]">{account.name}</p>
                          <p className="text-sm text-gray-500">{account.details}</p>
                        </div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tienes cuentas guardadas</p>
                  <p className="text-sm text-gray-400 mt-1">Agrega una cuenta para empezar</p>
                </div>
              )}
            </div>

            {savedAccounts.length > 0 && (
              <button
                onClick={() => {
                  if (savedAccounts.length > 0) {
                    onSelectAccount?.(savedAccounts[0]);
                  }
                }}
                className="w-full py-4 rounded-2xl font-semibold bg-[#2A906F] text-white hover:bg-[#1F6B52] transition-colors shadow-lg"
              >
                Continuar
              </button>
            )}
          </div>
        </section>
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

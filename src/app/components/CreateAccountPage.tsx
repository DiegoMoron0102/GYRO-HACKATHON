"use client";

import React, { useState } from "react";

interface BankAccountData {
  nickname: string;
  accountNumber: string;
  bankName: string;
}

interface CreateAccountPageProps {
  onBack?: () => void;
  onCreateAccount?: (accountData: BankAccountData) => void;
}

export default function CreateAccountPage({ onBack, onCreateAccount }: CreateAccountPageProps) {
  const [accountData, setAccountData] = useState<BankAccountData>({
    nickname: "",
    accountNumber: "",
    bankName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setAccountData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = () => {
    if (isValidData() && onCreateAccount) {
      onCreateAccount(accountData);
    }
  };

  const isValidData = () => {
    return accountData.nickname.length > 0 && 
           accountData.accountNumber.length > 0 && 
           accountData.bankName.length > 0;
  };

  return (
    <div className="create-account-full-screen">
      <main className="create-account-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Crear Cuenta</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-gray-50 p-4">
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Agregar dinero a tu cuenta</h2>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 space-y-6">
              <div>
                <label className="text-base font-medium text-[#1C2317] block mb-3">Apodo</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    value={accountData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    placeholder="Ingresa un apodo"
                    className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-[#1C2317] block mb-3">Número de cuenta</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    value={accountData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="Ingresa el número de cuenta"
                    className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-[#1C2317] block mb-3">Nombre del banco</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    value={accountData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Ingresa el nombre del banco"
                    className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleCreate}
            disabled={!isValidData()}
            className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
              isValidData()
                ? 'bg-[#2A906F] text-white hover:bg-[#1F6B52] shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Crear Cuenta
          </button>
        </footer>
      </main>

      <style jsx>{`
        .create-account-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f9fafb;
          z-index: 50;
        }

        .create-account-main {
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

"use client";

import React, { useEffect, useState } from "react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import {
  getLocalBalance,
  updateLocalBalance
} from "@/utils/balanceManager";

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

export default function WithdrawConfirmationPage({
  onBack,
  onConfirmWithdraw,
  selectedAccount,
}: WithdrawConfirmationPageProps) {
  const [amount, setAmount] = useState<number>(0);
  const [localBalance, setLocal] = useState<number>(0);
  const { sellRate } = useExchangeRate();

  useEffect(() => {
    setLocal(getLocalBalance());
  }, []);

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setAmount(numericValue);
  };

  const handleConfirm = () => {
    if (isValidAmount() && onConfirmWithdraw) {
      updateLocalBalance(-amount); // Resta al saldo
      setLocal(getLocalBalance()); // Actualiza el estado local para reflejarlo
      onConfirmWithdraw(amount);
    }
  };

  const isValidAmount = () => {
    return amount > 0 && amount <= localBalance;
  };

  if (!selectedAccount) {
    return (
      <div className="withdraw-confirmation-full-screen">
        <main className="withdraw-confirmation-main">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No se ha seleccionado una cuenta</p>
          </div>
        </main>
      </div>
    );
  }

  const convertedAmount =
    selectedAccount.type === "bank"
      ? (amount * sellRate).toFixed(2)
      : amount.toFixed(2);

  const convertedCurrency = selectedAccount.type === "bank" ? "BOB" : "USDT";

  return (
    <div className="withdraw-confirmation-full-screen">
      <main className="withdraw-confirmation-main">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#1C2317"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Retirar</h1>
          <div className="w-10"></div>
        </header>

        <section className="flex-1 bg-white p-4">
          <div className="space-y-6">
            {/* FROM */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Desde</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#1C2317]">USDT</p>
                      <p className="text-sm text-gray-500">Disponible: {localBalance.toFixed(2)} USDT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TO */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Hacia</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    {selectedAccount.type === "bank" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#1C2317]">{selectedAccount.name}</p>
                    <p className="text-sm text-gray-500">{selectedAccount.details}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AMOUNT */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Cantidad</p>
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 text-2xl font-bold bg-gray-50 rounded-xl border-none outline-none focus:bg-white focus:ring-2 focus:ring-[#2A906F] transition-all"
                min="0"
                max={localBalance}
                step="0.01"
              />
            </div>

            {/* RECEIVED */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Recibirás</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-[#1C2317]">{convertedAmount} {convertedCurrency}</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={handleConfirm}
              disabled={!isValidAmount()}
              className="w-full py-4 rounded-2xl font-semibold bg-[#2A906F] text-white hover:bg-[#1F6B52] transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Retirar
            </button>
          </div>
        </section>
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

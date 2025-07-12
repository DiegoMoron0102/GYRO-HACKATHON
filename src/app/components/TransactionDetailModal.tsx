"use client";

import React from "react";

interface Transaction {
  id: string;
  type: "retiro" | "deposito" | "transferencia";
  amount: number;
  merchant: string;
  date: string;
  time: string;
  transactionNumber: string;
}

interface TransactionDetailModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailModal({ 
  transaction, 
  isOpen, 
  onClose 
}: TransactionDetailModalProps) {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const isNegative = transaction.amount < 0;
  const displayAmount = Math.abs(transaction.amount);
  const amountColor = isNegative ? "text-red-600" : "text-green-600";
  const bgColor = isNegative ? "bg-red-50" : "bg-green-50";
  const iconColor = isNegative ? "#DC2626" : "#059669";
  const iconBgColor = isNegative ? "bg-red-100" : "bg-green-100";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-[360px] rounded-t-3xl p-4 animate-slide-up">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                {isNegative ? (
                  <path
                    d="M12 21L12 3M21 12L3 12"
                    stroke={iconColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M12 3L12 21M3 12L21 12"
                    stroke={iconColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {transaction.type === "retiro" ? "Retiro" : 
                 transaction.type === "deposito" ? "Depósito" : 
                 transaction.type === "transferencia" ? (isNegative ? "Transferencia Enviada" : "Transferencia Recibida") : 
                 transaction.merchant}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-blue-600 text-sm font-medium"
          >
            Listo
          </button>
        </div>

        {/* Transaction Details */}
        <div className="space-y-2 mb-6">
          {/* Amount */}
          <div className={`${bgColor} rounded-lg p-4`}>
            <h2 className={`text-3xl font-bold ${amountColor} text-center`}>
              {isNegative ? "-" : "+"}${displayAmount.toFixed(2)}
            </h2>
          </div>

          {/* Date */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Hoy</p>
            <p className="text-gray-900">{transaction.date} - {transaction.time}</p>
          </div>

          {/* Transaction Number */}
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaccion no.</p>
              <p className="text-gray-900 font-mono">{transaction.transactionNumber}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(transaction.transactionNumber)}
              className="p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  fill="#6B7280"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Report Problem Button */}
        <button className="w-auto flex items-center gap-2 text-red-600 font-medium">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 2.5L15 15.833M15 2.5L2.5 15.833"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Reportar Problema
        </button>
      </div>
    </div>
  );
}

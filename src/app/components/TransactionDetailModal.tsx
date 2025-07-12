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

interface Props {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailModal({ transaction, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const copyToClipboard = (txt: string) => navigator.clipboard.writeText(txt);

  const isNeg = transaction.amount < 0;
  const amount = Math.abs(transaction.amount).toFixed(2);
  const classes = {
    amt: isNeg ? "text-red-600" : "text-green-600",
    bg:  isNeg ? "bg-red-50"  : "bg-green-50",
    ico: isNeg ? "#DC2626"    : "#059669",
    ibg: isNeg ? "bg-red-100" : "bg-green-100",
  };

  /* ───────── JSX ───────── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}                                      
    >
      <div
        className="w-full max-w-[380px] rounded-t-3xl bg-white p-6 space-y-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}                 
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${classes.ibg} rounded-xl grid place-items-center`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                {isNeg ? (
                  <path d="M12 21V3M21 12H3" stroke={classes.ico} strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M12 3v18M3 12h18" stroke={classes.ico} strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 capitalize">
              {transaction.type === "deposito"
                ? "Depósito"
                : transaction.type === "retiro"
                ? "Retiro"
                : isNeg
                ? "Transferencia Enviada"
                : "Transferencia Recibida"}
            </h3>
          </div>

          <button onClick={onClose} className="text-blue-600 text-sm font-medium">
            Listo
          </button>
        </header>

        {/* Monto */}
        <div className={`${classes.bg} rounded-xl py-6`}>
          <p className={`text-4xl font-bold text-center ${classes.amt}`}>
            {isNeg ? "-" : "+"}${amount}
          </p>
        </div>

        {/* Fecha y hora */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-500">Hoy</p>
          <p className="text-gray-900">{`${transaction.date} · ${transaction.time}`}</p>
        </div>

        {/* Número de transacción */}
        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Transacción nº</p>
            <p className="font-mono text-sm">{transaction.transactionNumber}</p>
          </div>
          <button
            onClick={() => copyToClipboard(transaction.transactionNumber)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#6B7280">
              <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
            </svg>
          </button>
        </div>

        {/* Reportar problema */}
        <button className="flex items-center gap-2 text-red-600 font-medium hover:underline">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.5 2.5L17.5 17.5M17.5 2.5L2.5 17.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reportar problema
        </button>
      </div>

      {/* animaciones */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import TransactionDetailModal from "./TransactionDetailModal";

// Interfaz para transacciones del contrato (debe coincidir con useTransactionHistory)
interface ContractTransaction {
  amount: number;
  asset_type: { tag: string };
  date: string;
  from: string;
  to: string;
  transaction_type: { tag: string };
  tx_id: string;
}

// Interfaz que coincide con TransactionDetailModal
interface Transaction {
  id: string;
  type: "retiro" | "deposito" | "transferencia";
  amount: number;
  merchant: string;
  date: string;
  time: string;
  transactionNumber: string;
}

interface TransactionHistoryPageProps {
  onBack: () => void;
  userAddress: string;
  onNavigateToSettings?: () => void;
  onNavigateToMore?: () => void;
}

export default function TransactionHistoryPage({ 
  onBack, 
  userAddress,
  onNavigateToSettings,
  onNavigateToMore
}: TransactionHistoryPageProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { transactions, isLoading, error, refreshHistory } = useTransactionHistory({
    userAddress
  });

  const convertToModalTransaction = (contractTx: ContractTransaction): Transaction => {
    const type = getTransactionType(contractTx);
    
    return {
      id: contractTx.tx_id,
      type: type === 'deposit' ? 'deposito' : type === 'withdraw' ? 'retiro' : 'transferencia',
      amount: Math.abs(contractTx.amount),
      merchant: getTransactionLabel(contractTx),
      date: formatDate(contractTx.date),
      time: formatTime(contractTx.date),
      transactionNumber: contractTx.tx_id
    };
  };

  const handleTransactionClick = (contractTx: ContractTransaction) => {
    const modalTransaction = convertToModalTransaction(contractTx);
    setSelectedTransaction(modalTransaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const getTransactionType = (transaction: ContractTransaction): 'deposit' | 'withdraw' | 'transfer' => {
    if (transaction.transaction_type?.tag === 'Transfer') {
      // Si el from es el admin, es un depósito
      if (transaction.from && transaction.from.includes('GBHHQYYP6JMNBVDF5Y6JM3E3MMQFJNIFSOTSLYJFPKVWWYEQK2OR35J7')) {
        return 'deposit';
      }
      // Si el to es el admin, es un retiro
      if (transaction.to && transaction.to.includes('GBHHQYYP6JMNBVDF5Y6JM3E3MMQFJNIFSOTSLYJFPKVWWYEQK2OR35J7')) {
        return 'withdraw';
      }
    }
    return 'transfer';
  };

  const getTransactionLabel = (transaction: ContractTransaction) => {
    const type = getTransactionType(transaction);
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdraw':
        return 'Retiro';
      case 'transfer':
        // Determinar si es entrante o saliente basado en las direcciones
        if (transaction.to === userAddress) {
          return 'Transferencia recibida';
        } else {
          return 'Transferencia enviada';
        }
      default:
        return 'Transacción';
    }
  };

  const getTransactionIcon = (transaction: ContractTransaction) => {
    const type = getTransactionType(transaction);
    const isOutgoing = type === 'withdraw' || 
                     (type === 'transfer' && transaction.from === userAddress);
    
    return isOutgoing ? (
      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5,12 12,19 19,12"/>
        </svg>
      </div>
    ) : (
      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19,12 12,5 5,12"/>
        </svg>
      </div>
    );
  };

  const getTransactionAmount = (transaction: ContractTransaction) => {
    const type = getTransactionType(transaction);
    const isOutgoing = type === 'withdraw' || 
                      (type === 'transfer' && transaction.from === userAddress);
    const sign = isOutgoing ? '-' : '+';
    const colorClass = isOutgoing ? 'text-red-600' : 'text-green-600';
    
    return (
      <span className={`font-semibold ${colorClass}`}>
        {sign}${transaction.amount.toFixed(2)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Hoy';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer';
      } else {
        return date.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '00:00';
    }
  };

  const groupTransactionsByDate = (transactions: ContractTransaction[]) => {
    const grouped: { [key: string]: ContractTransaction[] } = {};
    
    transactions.forEach(transaction => {
      const dateKey = formatDate(transaction.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="transaction-history-full-screen">
      <main className="transaction-history-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Historial de Transacciones</h1>
          <button 
            onClick={refreshHistory}
            className="p-2 hover:bg-gray-50 rounded-lg"
            disabled={isLoading}
          >
            <svg 
              className={`w-6 h-6 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </header>

        {/* Content */}
        <section className="flex-1 bg-gray-50 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-[#2A906F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Cargando transacciones...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Aviso</h3>
                    <p className="text-sm text-yellow-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin transacciones</h3>
                <p className="text-gray-500">Aún no tienes transacciones registradas</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {Object.entries(groupedTransactions).map(([dateGroup, dayTransactions]) => (
                <div key={dateGroup}>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">{dateGroup}</h3>
                  <div className="bg-white rounded-xl overflow-hidden">
                    {dayTransactions.map((transaction, index) => (
                      <React.Fragment key={transaction.tx_id}>
                        <button
                          onClick={() => handleTransactionClick(transaction)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction)}
                            <div className="text-left">
                              <p className="font-medium text-gray-900">
                                {getTransactionLabel(transaction)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTime(transaction.date)}
                                {transaction.asset_type?.tag && ` • ${transaction.asset_type.tag}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTransactionAmount(transaction)}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M6 12L10 8L6 4"
                                stroke="#6B7280"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </button>
                        {index < dayTransactions.length - 1 && (
                          <div className="h-px bg-gray-100 mx-4"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-around">
            {/* Home */}
            <button 
              onClick={onBack}
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span className="text-xs mt-1">Inicio</span>
            </button>

            {/* History - Active */}
            <button 
              className="flex flex-col items-center p-2 text-[#2A906F]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span className="text-xs mt-1">Historial</span>
            </button>

            {/* Settings */}
            <button 
              onClick={onNavigateToSettings}
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span className="text-xs mt-1">Ajustes</span>
            </button>

            {/* More */}
            <button 
              onClick={onNavigateToMore}
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
              <span className="text-xs mt-1">Más</span>
            </button>
          </div>
        </nav>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </main>

      <style jsx>{`
        .transaction-history-full-screen {
          position: fixed;
          inset: 0;
          background: white;
          z-index: 50;
        }
        .transaction-history-main {
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

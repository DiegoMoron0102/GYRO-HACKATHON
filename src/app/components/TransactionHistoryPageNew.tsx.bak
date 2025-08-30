"use client";

import React, { useState } from "react";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import TransactionDetailModal from "./TransactionDetailModal";

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

// Interfaz para transacciones del contrato
interface ContractTransaction {
  amount: number;
  asset_type: { tag: string };
  date: string;
  from: string;
  to: string;
  transaction_type: { tag: string };
  tx_id: string;
}

interface TransactionHistoryPageProps {
  onBack: () => void;
  userAddress?: string;
  refreshKey?: number;
}

export default function TransactionHistoryPage({ 
  onBack, 
  userAddress, 
  refreshKey 
}: TransactionHistoryPageProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { transactions, isLoading, error, refreshHistory } = useTransactionHistory({
    userAddress,
    refreshKey
  });

  const handleTransactionClick = (transaction: ContractTransaction) => {
    // Convertir al formato esperado por el modal
    const modalTransaction: Transaction = {
      id: transaction.tx_id,
      type: transaction.transaction_type.tag === 'Transfer' ? 'transferencia' : 'deposito',
      amount: transaction.from === userAddress ? -transaction.amount : transaction.amount,
      merchant: getTransactionLabel(transaction),
      date: formatDate(transaction.date),
      time: formatTime(transaction.date),
      transactionNumber: transaction.tx_id
    };
    
    setSelectedTransaction(modalTransaction);
    setIsModalOpen(true);
  };

  const getTransactionLabel = (transaction: ContractTransaction) => {
    switch (transaction.transaction_type.tag) {
      case 'Transfer':
        return 'Transferencia USDC';
      default:
        return 'Transacción';
    }
  };

  const getTransactionIcon = (transaction: ContractTransaction) => {
    const isOutgoing = transaction.from === userAddress;
    
    return isOutgoing ? (
      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 14L8 2M14 8L2 8"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ) : (
      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L8 14M14 8L2 8"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const getTransactionAmount = (transaction: ContractTransaction) => {
    const isOutgoing = transaction.from === userAddress;
    const amount = transaction.amount.toFixed(2);
    const colorClass = isOutgoing ? 'text-red-600' : 'text-green-600';
    const sign = isOutgoing ? '-' : '+';
    
    return (
      <span className={`font-medium ${colorClass}`}>
        {sign}${amount} USDC
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const groupTransactionsByDate = (transactions: ContractTransaction[]) => {
    const groups: Record<string, ContractTransaction[]> = {};
    
    transactions.forEach(transaction => {
      const dateKey = formatDate(transaction.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const today = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    if (dateString === today) {
      return 'Hoy';
    } else if (dateString === yesterdayString) {
      return 'Ayer';
    } else {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="transaction-history-full-screen">
        <main className="transaction-history-main">
          <header className="flex items-center justify-between p-4 border-b bg-white">
            <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-[#1C2317]">Historial de transacciones</h1>
            <div className="w-10" />
          </header>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#2A906F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando historial...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-full-screen">
        <main className="transaction-history-main">
          <header className="flex items-center justify-between p-4 border-b bg-white">
            <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-[#1C2317]">Historial de transacciones</h1>
            <div className="w-10" />
          </header>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error cargando el historial</p>
              <button
                onClick={refreshHistory}
                className="px-4 py-2 bg-[#2A906F] text-white rounded-lg hover:bg-[#1F6B52]"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="transaction-history-full-screen">
      <main className="transaction-history-main">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Historial de transacciones</h1>
          <button onClick={refreshHistory} className="p-2 hover:bg-gray-50 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#1C2317" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="#1C2317" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        <section className="flex-1 bg-gray-50 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16L14 18L20 12"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay transacciones
              </h3>
              <p className="text-gray-500 max-w-xs">
                Aún no has realizado ninguna transacción. Cuando lo hagas, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {Object.entries(groupedTransactions)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, dayTransactions]) => (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      {formatDateHeader(date)}
                    </h3>
                    <div className="bg-white rounded-xl overflow-hidden">
                      {dayTransactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((transaction, index) => (
                          <div
                            key={transaction.tx_id}
                            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                              index !== dayTransactions.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                            onClick={() => handleTransactionClick(transaction)}
                          >
                            <div className="flex items-center space-x-3">
                              {getTransactionIcon(transaction)}
                              <div>
                                <p className="font-medium text-[#1C2317] text-sm">
                                  {getTransactionLabel(transaction)}
                                </p>
                                <p className="text-xs text-[#698282]">
                                  {formatTime(transaction.date)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {getTransactionAmount(transaction)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center space-y-1 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs">Inicio</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-[#2A906F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs">Historial</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs">Perfil</span>
            </button>
          </div>
        </nav>
      </main>

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}

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

"use client";

import React, { useState } from "react";
import TransactionDetailModal from "./TransactionDetailModal";

interface HistoryPageProps {
  onBack?: () => void;
  onNavigateToMore?: () => void;
}

interface Transaction {
  id: string;
  type: "retiro" | "deposito" | "transferencia";
  amount: number;
  merchant: string;
  date: string;
  time: string;
  transactionNumber: string;
}

export default function HistoryPage({ onBack, onNavigateToMore }: HistoryPageProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "retiro",
      amount: -35.23,
      merchant: "Retiro",
      date: "Junio 26, 2024",
      time: "12:32",
      transactionNumber: "23010412432431"
    },
    {
      id: "2", 
      type: "transferencia",
      amount: 430.00,
      merchant: "De Diego",
      date: "Junio 25, 2024",
      time: "02:15",
      transactionNumber: "23010412432432"
    },
    {
      id: "3",
      type: "retiro", 
      amount: -19.00,
      merchant: "Retiro",
      date: "Diciembre 24, 2024",
      time: "16:53",
      transactionNumber: "23010412432433"
    }
  ];

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="history-full-screen">
      <main className="history-main">
        {/* Header */}
        <header className="history-header">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-[#1C2317]">Historial</h1>
          </div>
        </header>

        {/* Content */}
        <section className="history-content">
          {/* Today Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-600 mb-3 px-4">Hoy</h3>
            
            <div className="px-4 mb-3">
              <button 
                onClick={() => handleTransactionClick(transactions[0])}
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 14L8 2M14 8L2 8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Retiro</p>
                    <p className="text-sm text-gray-500">Hoy 12:32</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-600 font-medium">-$35.23</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-4"></div>
          </div>

          {/* Separator */}
          <div className="h-1.5 bg-gray-100 mb-6"></div>

          {/* Yesterday Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-600 mb-3 px-4">Ayer</h3>
            
            <div className="px-4 mb-3">
              <button 
                onClick={() => handleTransactionClick(transactions[1])}
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2L8 14M2 8L14 8" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">De Diego</p>
                    <p className="text-sm text-gray-500">Ayer 02:15</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600 font-medium">+$430.00</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-4"></div>
          </div>

          {/* Separator */}
          <div className="h-1.5 bg-gray-100 mb-6"></div>

          {/* Martes Section */}
          <div className="mb-6">
            <div className="px-4 mb-3">
              <p className="text-sm text-gray-500">Martes</p>
              <h3 className="text-lg font-medium text-gray-600">Diciembre 24, 2024</h3>
            </div>
            
            <div className="px-4 mb-3">
              <button 
                onClick={() => handleTransactionClick(transactions[2])}
                className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 14L8 2M14 8L2 8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Retiro</p>
                    <p className="text-sm text-gray-500">Dic 24, 16:53</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-600 font-medium">-$19.00</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
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
    </div>
  );
}

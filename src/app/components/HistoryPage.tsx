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

        {/* Navigation */}
        <nav className="history-nav">
          <div className="flex justify-between">
            <button 
              onClick={onBack}
              className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-xs">Inicio</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-6 text-[#2A906F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              </svg>
              <span className="text-xs">Historial</span>
            </button>
            
            <button
              className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400 hover:text-[#2A906F]"
              onClick={onNavigateToMore}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H3V11H21V9M4 13H20V22H4V13Z" />
              </svg>
              <span className="text-xs">Más</span>
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

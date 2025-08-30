"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import TransactionDetailModal from "./TransactionDetailModal";
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useContractBalance } from '@/hooks/useContractBalance';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';

//import * as Client from "../../../packages/user";

interface Transaction {
  id: string;
  type: "retiro" | "deposito" | "transferencia";
  amount: number;
  merchant: string;
  date: string;
  time: string;
  transactionNumber: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
  stellarPublicKey?: string;
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

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateToHistory: () => void;
  onNavigateToMore: () => void;
  onNavigateToSettings: () => void;
  onNavigateToDeposit: () => void;
  onNavigateToWithdraw: () => void;
  onNavigateToQRScanner: () => void;
  onNavigateToDepositQR: () => void;
  balanceRefreshKey?: number; // Key para forzar refrescar balance
}

/* ───────── Fake conversión XLM→USDC para MVP ───────── */

/* ───────── Componente ───────── */
export default function Dashboard({
  user,
  onNavigateToHistory,
  onNavigateToMore,
  onNavigateToSettings,
  onNavigateToDeposit,
  onNavigateToWithdraw,
  onNavigateToQRScanner,
  onNavigateToDepositQR,
  balanceRefreshKey
}: DashboardProps) {
  /* ---------- estado ---------- */
  
  
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const { buyRate, sellRate, loading: rateLoading, error: rateError, refreshRate } = useExchangeRate();

 
  // Clave de Stellar del usuario. Se inicializa con el valor de las props o del localStorage.
  
  
  // Obtener la dirección del usuario desde localStorage o props
  const userAddress = user.stellarPublicKey || localStorage.getItem('userAddress') || undefined;
  
  // Usar el hook del contrato para obtener el balance real
  const { balance: contractBalance, loading: balanceLoading, error: balanceError, refreshBalance } = useContractBalance({
    userAddress,
    assetType: "USDC",
    refreshKey: balanceRefreshKey
  });

  // Obtener historial de transacciones reales
  const { transactions: recentTransactions, isLoading: transactionsLoading, refreshHistory } = useTransactionHistory({
    userAddress: userAddress || ''
  });

  // Mostrar solo las 3 transacciones más recientes en el dashboard
  const dashboardTransactions = recentTransactions.slice(0, 3).map(tx => {
    // Determinar el tipo de transacción
    const getTransactionType = () => {
      if (tx.transaction_type?.tag === 'Transfer') {
        // Si el from es el admin, es un depósito
        if (tx.from && tx.from.includes('GBHHQYYP6JMNBVDF5Y6JM3E3MMQFJNIFSOTSLYJFPKVWWYEQK2OR35J7')) {
          return 'deposito';
        }
        // Si el to es el admin, es un retiro
        if (tx.to && tx.to.includes('GBHHQYYP6JMNBVDF5Y6JM3E3MMQFJNIFSOTSLYJFPKVWWYEQK2OR35J7')) {
          return 'retiro';
        }
      }
      return 'transferencia';
    };

    const transactionType = getTransactionType();
    
    return {
      id: tx.tx_id,
      type: transactionType as 'retiro' | 'deposito' | 'transferencia',
      amount: transactionType === 'retiro' ? -tx.amount : tx.amount,
      merchant: transactionType === 'deposito' ? 'Depósito' : 
                transactionType === 'retiro' ? 'Retiro' : 'Transferencia',
      date: new Date(tx.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(tx.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
      transactionNumber: tx.tx_id
    };
  });

  console.log("📊 Dashboard: Balance info", {
    userAddress,
    contractBalance,
    balanceLoading,
    balanceError,
    balanceRefreshKey
  });

  // Fallback al balance simulado si no hay dirección o hay error
  const [simulatedBalance, setSimulatedBalance] = useState<number>(0);
  
  useEffect(() => {
    if (!userAddress || balanceError) {
      const stored = localStorage.getItem("simulatedBalance");
      setSimulatedBalance(stored ? parseFloat(stored) : 0);
    }
  }, [userAddress, balanceError]);

  // Usar el balance del contrato si está disponible, sino el simulado
  const displayBalance = userAddress && !balanceError ? contractBalance : simulatedBalance;
  
  console.log("💰 Dashboard: Final display balance", displayBalance);

  /* ---------- helpers ---------- */
  const handleTransactionClick = (t: Transaction) => {
    setSelectedTransaction(t);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    const isNegative = transaction.amount < 0;
    return isNegative ? (
      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 14L8 2M14 8L2 8"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ) : (
      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L8 14M2 8L14 8"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const isNegative = transaction.amount < 0;
    const amount = Math.abs(transaction.amount).toFixed(2);
    const colorClass = isNegative ? 'text-red-600' : 'text-green-600';
    const sign = isNegative ? '-' : '+';
    
    return (
      <span className={`font-medium ${colorClass}`}>
        {sign}${amount}
      </span>
    );
  };




  return (
    <div className="dashboard-full-screen">
      <main className="dashboard-main">
        {/* Top Section */}
        <section className="dashboard-top-section">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/images/profile.png"
                  alt="Profile Avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm opacity-90">Hola,</p>
                <p className="font-semibold">{user.name.split(" ")[0]}</p>
              </div>
            </div>
            <button 
              className="p-2"
              onClick={onNavigateToSettings}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>


          
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#2A906F] to-[#1F6B52] rounded-2xl p-6">
            <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <p className="text-sm opacity-75">Saldo</p>
              {userAddress && (
                <button 
                  onClick={refreshBalance}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  title="Actualizar balance"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            <div className="text-4xl font-bold">
              {balanceLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                `${displayBalance.toFixed(2)} USDC`
              )}
            </div>
            {balanceError && (
              <p className="text-xs text-red-300 mt-1">
                ⚠️ Error cargando balance
              </p>
            )}
          </div>
            <div className="flex justify-center gap-6">
              <button 
                className="flex flex-col items-center gap-2"
                onClick={() => {
                  console.log('Deposit button clicked');
                  if (onNavigateToDeposit) {
                    onNavigateToDeposit();
                  } else {
                    console.error('onNavigateToDeposit is not defined');
                  }
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="19,12 12,5 5,12"/>
                  </svg>
                </div>
                <span className="text-sm">Depositar</span>
              </button>

              <div className="w-px h-8 bg-white/30 self-center"></div>

              <button 
                className="flex flex-col items-center gap-2"
                onClick={() => {
                  console.log('Withdraw button clicked');
                  if (onNavigateToWithdraw) {
                    onNavigateToWithdraw();
                  } else {
                    console.error('onNavigateToWithdraw is not defined');
                  }
                }}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5,12 12,19 19,12"/>
                  </svg>
                </div>
                <span className="text-sm">Retirar</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="dashboard-content">
          {/* Exchange Rates */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
                Tasa de Cambio
              </h3>
              <button 
                onClick={refreshRate}  // ← Cambio aquí: usar refreshRate en lugar de window.location.reload()
                className={`p-1 ${rateLoading ? 'animate-spin' : ''}`}
                disabled={rateLoading}
                title="Actualizar tasas"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Dólar Gyro
              {rateError && (
                <span className="text-red-500 text-xs ml-2">⚠️ Error en API</span>
              )}
            </p>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-[#2A906F] font-medium">Depositar</p>
                {rateLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#2A906F] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 font-semibold">
                    {buyRate.toFixed(2)} Bs
                  </p>
                )}
                
              </div>
              
              <div className="w-px h-12 bg-gray-200"></div>
              
              <div className="text-center">
                <p className="text-[#2A906F] font-medium">Retirar</p>
                {rateLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#2A906F] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 font-semibold">
                    {sellRate.toFixed(2)} Bs 
                  </p>
                )}
                
              </div>
            </div>

            {/* Última actualización */}
            {!rateLoading && !rateError && (
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Actualizado hace {new Date().toLocaleTimeString('es-BO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            )}


          {/* Transactions */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Movimientos</h3>
                {userAddress && (
                  <button 
                    onClick={refreshHistory}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Actualizar historial"
                    disabled={transactionsLoading}
                  >
                    <svg className={`w-4 h-4 text-gray-400 ${transactionsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <button 
                onClick={onNavigateToHistory}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-3">
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-[#2A906F] rounded-full animate-spin"></div>
                </div>
              ) : dashboardTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No hay transacciones recientes</p>
                </div>
              ) : (
                dashboardTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <button 
                      onClick={() => handleTransactionClick(transaction)}
                      className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction)}
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{transaction.merchant}</p>
                          <p className="text-sm text-gray-500">{transaction.date} {transaction.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
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
                    {index < dashboardTransactions.length - 1 && (
                      <div className="h-px bg-gray-100"></div>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 px-4 py-4">
          <div className="flex items-center justify-around relative">
            {/* Home */}
            <button 
              onClick={() => {/* Ya estamos en home */}}
              className="flex flex-col items-center p-2 text-[#2A906F]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span className="text-xs mt-1">Inicio</span>
            </button>

            {/* History */}
            <button 
              onClick={onNavigateToHistory}
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span className="text-xs mt-1">Historial</span>
            </button>

            {/* Central QR Button - MUCH LARGER */}
            <button 
              onClick={() => setShowQRModal(true)}
              className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mr-4 ring-2 ring-white/70"            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" rx="1" />
                <rect x="19" y="19" width="2" height="2" rx="1" />
                <rect x="14" y="19" width="3" height="2" rx="1" />
                <rect x="19" y="14" width="2" height="3" rx="1" />
              </svg>
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

        {/* QR Options Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              
              <h3 className="text-xl font-semibold text-center text-[#1C2317] mb-6">
                Opciones QR
              </h3>
              
              <div className="space-y-4">
                {/* Generate Deposit QR */}
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    onNavigateToDepositQR();
                  }}
                  className="w-full flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <polyline points="19,12 12,5 5,12"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-[#1C2317]">Generar QR de depósito</h4>
                    <p className="text-sm text-gray-500">Crear código QR para recibir pagos</p>
                  </div>
                </button>

                {/* Scan QR for Withdrawal */}
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    onNavigateToQRScanner();
                  }}
                  className="w-full flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-[#1C2317]">Escanear QR para retiro</h4>
                    <p className="text-sm text-gray-500">Escanear código de cuenta bancaria</p>
                  </div>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full mt-6 py-3 text-gray-500 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}



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
            animation: slide-up 0.3s ease-out;
          }

          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </main>
    </div>
  );
}

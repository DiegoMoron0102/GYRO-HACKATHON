"use client";

import React from "react";

interface WithdrawSuccessPageProps {
  onDone?: () => void;
  amount?: number;
  accountName?: string;
  transactionId?: string;
}

export default function WithdrawSuccessPage({ 
  onDone, 
  amount = 100, 
  accountName = "Bank of America", 
  transactionId = "2104" 
}: WithdrawSuccessPageProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="withdraw-success-full-screen">
      <main className="withdraw-success-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white">
          <button onClick={onDone} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Retiro exitoso</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-6 flex flex-col">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            {/* Money/Coins Icon */}
            <div className="mb-6">
              <div className="relative mx-auto w-32 h-24">
                {/* Stack of coins */}
                <div className="absolute bottom-0 left-4">
                  <div className="w-12 h-8 bg-yellow-400 rounded-full relative">
                    <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-8 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-8">
                  <div className="w-12 h-8 bg-yellow-400 rounded-full relative">
                    <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-8 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-12">
                  <div className="w-12 h-8 bg-yellow-400 rounded-full relative">
                    <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-8 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-16">
                  <div className="w-12 h-8 bg-yellow-400 rounded-full relative">
                    <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-8 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#1C2317] mb-2">
              Has retirado exitosamente
            </h2>
            <p className="text-4xl font-bold text-[#1C2317] mb-4">
              ${amount}
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              El dinero será transferido a tu cuenta bancaria en un plazo de 1 a 3 días hábiles
            </p>
          </div>

          {/* Transaction Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#1C2317] mb-4">
              Detalles de la transacción
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Cantidad</span>
                <span className="font-semibold text-[#1C2317]">${amount}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">ID</span>
                <span className="font-semibold text-[#1C2317]">{transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Fecha</span>
                <span className="font-semibold text-[#1C2317]">{currentDate}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Destino</span>
                <span className="font-semibold text-[#1C2317]">{accountName}</span>
              </div>
            </div>
          </div>

          {/* Done Button */}
          <div className="mt-8">
            <button
              onClick={onDone}
              className="w-full bg-[#2A906F] text-white py-4 rounded-2xl font-semibold hover:bg-[#1F6B52] transition-colors shadow-lg"
            >
              Listo
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        .withdraw-success-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .withdraw-success-main {
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

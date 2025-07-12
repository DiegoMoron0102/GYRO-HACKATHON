"use client";

import React from "react";

interface WithdrawPageProps {
  onBack?: () => void;
  onWithdrawBolivianos?: () => void;
  onWithdrawCrypto?: () => void;
}

export default function WithdrawPage({ onBack, onWithdrawBolivianos, onWithdrawCrypto }: WithdrawPageProps) {
  return (
    <div className="withdraw-full-screen">
      <main className="withdraw-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Withdraw</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white">
          {/* Withdraw in Bolivianos Section */}
          <div className="px-4 py-6">
            {/* Option Item */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 14L8 2M14 8L2 8" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M22 12L12 22L2 12" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#1C2317]">Withdraw in Bolivianos</h3>
              </div>
            </div>

            {/* Withdraw Button for Bolivianos */}
            <button 
              onClick={onWithdrawBolivianos}
              className="w-full bg-[#2A906F] text-white py-3 rounded-3xl font-medium hover:bg-[#1F6B52] transition-colors mb-12"
            >
              Withdraw
            </button>
          </div>

          {/* Separator */}
          <div className="h-1.5 bg-gray-50"></div>

          {/* Withdraw in Cryptocurrencies Section */}
          <div className="px-4 py-6">
            {/* Option Item */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#1C2317" strokeWidth="1.5"/>
                  <path d="M8 14L8 2M14 8L2 8" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3" stroke="#1C2317" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#1C2317]">Withdraw in Cryptocurrencies</h3>
              </div>
            </div>

            {/* Withdraw Button for Crypto */}
            <button 
              onClick={onWithdrawCrypto}
              className="w-full bg-[#2A906F] text-white py-3 rounded-3xl font-medium hover:bg-[#1F6B52] transition-colors"
            >
              Withdraw
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        .withdraw-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .withdraw-main {
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

"use client";

import React, { useState } from "react";

interface CryptoWalletData {
  walletName: string;
  walletAddress: string;
  network: string;
}

interface CreateCryptoWalletPageProps {
  onBack?: () => void;
  onCreateWallet?: (walletData: CryptoWalletData) => void;
}

const networks = [
  { id: "ethereum", name: "Ethereum (ERC-20)" },
  { id: "tron", name: "Tron (TRC-20)" },
  { id: "binance", name: "Binance Smart Chain (BEP-20)" },
  { id: "polygon", name: "Polygon (MATIC)" },
];

export default function CreateCryptoWalletPage({ onBack, onCreateWallet }: CreateCryptoWalletPageProps) {
  const [walletData, setWalletData] = useState<CryptoWalletData>({
    walletName: "",
    walletAddress: "",
    network: "",
  });
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setWalletData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNetworkSelect = (networkId: string) => {
    handleInputChange('network', networkId);
    setShowNetworkDropdown(false);
  };

  const handleCreate = () => {
    if (isValidData() && onCreateWallet) {
      onCreateWallet(walletData);
    }
  };

  const isValidData = () => {
    return walletData.walletName.length > 0 && 
           walletData.walletAddress.length > 0 && 
           walletData.network.length > 0;
  };

  const getSelectedNetworkName = () => {
    const selected = networks.find(n => n.id === walletData.network);
    return selected ? selected.name : "Seleccionar red";
  };

  return (
    <div className="create-wallet-full-screen">
      <main className="create-wallet-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Crear wallet</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-4">
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold text-[#1C2317] mb-2">Nombra tu wallet</h2>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="text-base font-medium text-[#1C2317] block mb-3">Nombre del wallet</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    value={walletData.walletName}
                    onChange={(e) => handleInputChange('walletName', e.target.value)}
                    placeholder="Nombre del wallet"
                    className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-[#1C2317] block mb-3">Dirección del wallet</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    value={walletData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    placeholder="Dirección del wallet"
                    className="w-full bg-transparent text-base text-[#1C2317] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-[#1C2317] block mb-3">Red</label>
                <div className="relative">
                  <button
                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                    className="w-full bg-gray-50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <span className={`text-base ${walletData.network ? 'text-[#1C2317]' : 'text-gray-400'}`}>
                      {getSelectedNetworkName()}
                    </span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      className={`text-[#698282] transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`}
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {showNetworkDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => handleNetworkSelect(network.id)}
                          className="w-full p-4 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                        >
                          <span className="text-[#1C2317]">{network.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleCreate}
            disabled={!isValidData()}
            className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
              isValidData()
                ? 'bg-[#2A906F] text-white hover:bg-[#1F6B52] shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Crear wallet
          </button>
        </footer>
      </main>

      <style jsx>{`
        .create-wallet-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .create-wallet-main {
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

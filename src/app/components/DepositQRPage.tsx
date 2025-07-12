"use client";

import React, { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface DepositQRPageProps {
  onBack?: () => void;
  amount?: number;
  reference?: string;
  currency?: string;
  cryptocurrency?: string;
}

export default function DepositQRPage({ onBack, amount, reference, currency = "BOB", cryptocurrency }: DepositQRPageProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [includeAmount, setIncludeAmount] = useState<boolean>(!!amount);
  const [copied, setCopied] = useState(false);

  // Wallet addresses for different cryptocurrencies
  const getWalletAddress = () => {
    const walletAddresses = {
      USDT: "TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS",
      BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      ETH: "0x742d35Cc6634C0532925a3b8D45Eb3f5C6BcA7E9",
      BNB: "bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23",
      BOB: "TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS" // Default for Bolivianos
    };
    
    return walletAddresses[cryptocurrency as keyof typeof walletAddresses] || walletAddresses.BOB;
  };

  const walletAddress = getWalletAddress();

  // Generate QR code data
  const generateQRData = useCallback(() => {
    let qrData = walletAddress;
    
    if (includeAmount && amount) {
      // Add amount to QR for specific payment
      const displayCurrency = cryptocurrency || currency;
      qrData = `${walletAddress}?amount=${amount}&currency=${displayCurrency}`;
      if (reference) {
        qrData += `&memo=${encodeURIComponent(reference)}`;
      }
    }
    
    return qrData;
  }, [walletAddress, includeAmount, amount, cryptocurrency, currency, reference]);

  // Generate QR code image
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = generateQRData();
        const qrImage = await QRCode.toDataURL(qrData, {
          width: 280,
          margin: 2,
          color: {
            dark: '#1C2317',
            light: '#FFFFFF'
          }
        });
        setQrCodeImage(qrImage);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [generateQRData]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const toggleAmount = () => {
    setIncludeAmount(!includeAmount);
  };

  return (
    <div className="deposit-qr-full-screen">
      <main className="deposit-qr-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Deposit QR Code</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-6 flex flex-col items-center">
          {/* QR Amount Toggle */}
          {amount && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-[#1C2317]">Include amount in QR</p>
                  <p className="text-sm text-[#698282]">
                    {includeAmount ? `${amount} ${currency}` : 'Flexible amount'}
                  </p>
                </div>
                <button
                  onClick={toggleAmount}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    includeAmount ? 'bg-[#2A906F]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    includeAmount ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            {qrCodeImage ? (
              <Image 
                src={qrCodeImage} 
                alt="Deposit QR Code" 
                width={280}
                height={280}
                className="mx-auto"
              />
            ) : (
              <div className="w-70 h-70 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A906F]"></div>
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="w-full space-y-4 mb-6">
            {includeAmount && amount && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-[#698282] font-medium">Amount</span>
                <span className="text-[#1C2317] font-semibold">
                  {amount} {cryptocurrency || currency}
                </span>
              </div>
            )}
            
            {cryptocurrency && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-[#698282] font-medium">Cryptocurrency</span>
                <span className="text-[#1C2317] font-medium">{cryptocurrency}</span>
              </div>
            )}
            
            {includeAmount && reference && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-[#698282] font-medium">Reference</span>
                <span className="text-[#1C2317] font-medium">{reference}</span>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#698282] font-medium">Wallet Address</span>
                <button 
                  onClick={handleCopyAddress}
                  className="text-[#2A906F] hover:text-[#1F6B52] font-medium"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-[#1C2317] font-mono break-all">
                {walletAddress}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-[#1C2317] mb-2">Instructions:</h3>
            <ul className="space-y-1 text-sm text-[#698282]">
              <li>• Scan this QR code with your wallet app</li>
              {cryptocurrency ? (
                <>
                  <li>• Send {cryptocurrency} to the address above</li>
                  <li>• Make sure you&apos;re on the correct network</li>
                </>
              ) : (
                <li>• Send the exact amount shown above</li>
              )}
              <li>• Your deposit will be processed automatically</li>
              <li>• Keep this reference for your records</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-4 bg-white">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-3xl font-medium bg-gray-100 text-[#1C2317] hover:bg-gray-200 transition-colors"
          >
            Done
          </button>
        </footer>
      </main>

      <style jsx>{`
        .deposit-qr-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }

        .deposit-qr-main {
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

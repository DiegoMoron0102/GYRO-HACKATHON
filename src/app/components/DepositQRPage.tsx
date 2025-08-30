"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useDepositSmart } from "@/hooks/useDepositSmart";

interface DepositQRPageProps {
  onBack?: () => void;
  amount: number;
  reference: string;
  currency: string;
  cryptocurrency: string;
  stellarPublicKey?: string;
  onRefreshBalance?: () => void; // Callback para refrescar balance
}

export default function DepositQRPage({
  onBack,
  amount,
  reference,
  currency,
  cryptocurrency,
  stellarPublicKey,
  onRefreshBalance
}: DepositQRPageProps) {
  const [pubKey, setPubKey] = useState<string | null>(null);
  const [includeAmt, setInc] = useState<boolean>(amount > 0);
  const [amountVal, setAmt] = useState<number>(amount);
  const [qrImg, setQrImg] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>(amount > 0 ? amount.toString() : "");
  const { buyRate } = useExchangeRate();
  
  // Hook para depósitos con smart contracts
  const { processDeposit, loading, error, success, resetState } = useDepositSmart();

  const storedPubKey =
    typeof window !== "undefined" ? localStorage.getItem("publicKey") : null;

  useEffect(() => setAmt(amount), [amount]);

  useEffect(() => {
    if (stellarPublicKey) return setPubKey(stellarPublicKey);
    if (storedPubKey) setPubKey(storedPubKey);
  }, [stellarPublicKey, storedPubKey]);

  useEffect(() => {
    if (!pubKey) return;
    let url = pubKey;
    
    // Si incluye cantidad Y hay una cantidad válida
    if (includeAmt && parseFloat(customAmount) > 0) {
      const curr = cryptocurrency || currency;
      const finalAmount = parseFloat(customAmount);
      url += `?amount=${finalAmount}&currency=${curr}`;
      if (reference) url += `&memo=${encodeURIComponent(reference)}`;
    }
    
    QRCode.toDataURL(url, { width: 280, margin: 2 })
      .then(setQrImg)
      .catch(console.error);
  }, [pubKey, includeAmt, customAmount, currency, cryptocurrency, reference]);

  const copy = async () => {
    if (!pubKey) return;
    await navigator.clipboard.writeText(pubKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const displayCurr = cryptocurrency || currency;

  const handleRealDeposit = async () => {
    try {
      const userAddress = stellarPublicKey || pubKey;
      if (!userAddress) throw new Error("Falta la clave pública");

      // Usar el monto personalizado si está disponible, sino el monto original
      const finalAmount = includeAmt && parseFloat(customAmount) > 0 
        ? parseFloat(customAmount) 
        : amountVal;

      if (finalAmount <= 0) {
        throw new Error("Debe especificar un monto válido para procesar el depósito");
      }

      // Calcular el monto en USDC si es BOB (sin redondear)
      const usdcAmount = currency === "BOB" ? finalAmount / buyRate : finalAmount;
      
      console.log("💳 Ejecutando depósito real:", {
        userAddress,
        originalAmount: finalAmount,
        convertedAmount: usdcAmount,
        currency,
        reference
      });

      // Ejecutar depósito real usando smart contracts (conservar decimales)
      await processDeposit({
        userPublicKey: userAddress,
        amount: Number(usdcAmount.toFixed(2)), // Redondear solo a 2 decimales sin multiplicar por 100
        description: reference || ""
      });

      // Refrescar balance después del depósito exitoso
      if (success && onRefreshBalance) {
        setTimeout(() => {
          onRefreshBalance();
        }, 2000); // Esperar 2 segundos para que se confirme en la blockchain
      }

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("❌ Error en depósito real:", message);
    }
  };

  // Resetear estado cuando se monta el componente
  useEffect(() => {
    resetState();
  }, [resetState]);

  return (
    <div className="deposit-qr-full-screen">
        <main className="deposit-qr-main">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Código QR de depósito</h1>
          <div className="w-10" />
        </header>

        <section className="flex-1 bg-white p-6 flex flex-col items-center space-y-6 overflow-y-auto">
          {/* Toggle y campo de cantidad personalizada */}
          <div className="w-full space-y-4">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    includeAmt ? "bg-[#2A906F]" : "bg-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeAmt}
                    onChange={(e) => setInc(e.target.checked)}
                  />
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      includeAmt ? "translate-x-6" : ""
                    }`}
                  />
                </div>
                <span className="font-medium text-[#1C2317]">Incluir cantidad</span>
              </div>

              <span className="text-sm text-[#698282]">
                {includeAmt && parseFloat(customAmount) > 0 
                  ? currency === "BOB"
                    ? `${(parseFloat(customAmount) / buyRate).toFixed(2)} USDC (${parseFloat(customAmount)} BOB)`
                    : `${parseFloat(customAmount)} ${displayCurr}`
                  : "QR abierto"}
              </span>
            </label>

            {/* Campo de cantidad personalizada */}
            {includeAmt && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1C2317]">
                  Cantidad a depositar
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A906F] focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {displayCurr}
                  </span>
                </div>
                {currency === "BOB" && parseFloat(customAmount) > 0 && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>📊 Conversión:</p>
                    <p>• {parseFloat(customAmount)} BOB</p>
                    <p>• ≈ {(parseFloat(customAmount) / buyRate).toFixed(4)} USDC</p>
                    <p>• Tasa: 1 USD = {buyRate.toFixed(2)} BOB</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            {qrImg ? (
              <Image src={qrImg} alt="QR" width={280} height={280} className="mx-auto" />
            ) : (
              <div className="w-[280px] h-[280px] bg-gray-100 grid place-items-center rounded-xl">
                <div className="animate-spin w-8 h-8 border-2 border-[#2A906F] border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {pubKey && (
            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#698282] font-medium">Dirección de la wallet</span>
                <button
                  onClick={copy}
                  className="text-[#2A906F] font-medium hover:text-[#1F6B52] transition"
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="font-mono text-sm break-all text-[#1C2317]">{pubKey}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">
                ❌ Error: {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-600 text-sm">
                ✅ Depósito realizado con éxito
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="w-full space-y-3">
            <button
              onClick={handleRealDeposit}
              disabled={loading || (includeAmt && parseFloat(customAmount) <= 0)}
              className={`w-full py-3 rounded-3xl font-medium transition ${
                loading || (includeAmt && parseFloat(customAmount) <= 0)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2A906F] text-white hover:bg-[#1F6B52]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando depósito...
                </div>
              ) : includeAmt && parseFloat(customAmount) <= 0 ? (
                'Ingrese cantidad válida'
              ) : includeAmt ? (
                currency === "BOB"
                  ? `Depositar ${(parseFloat(customAmount) / buyRate).toFixed(2)} USDC`
                  : `Depositar ${parseFloat(customAmount)} ${displayCurr}`
              ) : (
                'Generar QR abierto'
              )}
            </button>

            {/* Botón de simulación solo si hay monto */}
            {includeAmt && parseFloat(customAmount) > 0 && (
              <button
                onClick={async () => {
                  // Simular depósito exitoso
                  alert(`🎯 Simulación: Depósito de ${currency === "BOB" ? `${(parseFloat(customAmount) / buyRate).toFixed(2)} USDC` : `${parseFloat(customAmount)} ${displayCurr}`} procesado exitosamente!`);
                  if (onRefreshBalance) {
                    onRefreshBalance();
                  }
                }}
                className="w-full py-3 rounded-3xl font-medium border-2 border-[#2A906F] text-[#2A906F] hover:bg-[#2A906F] hover:text-white transition"
              >
                🧪 Simular Depósito
              </button>
            )}
          </div>
        </section>

        <footer className="p-4 bg-white">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-3xl font-medium bg-gray-100 text-[#1C2317] hover:bg-gray-200 transition-colors"
          >
            Listo
          </button>
        </footer>
      </main>

      <style jsx>{`
        .deposit-qr-full-screen {
          position: fixed;
          inset: 0;
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

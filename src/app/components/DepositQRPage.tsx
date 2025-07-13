"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { getPublicKey } from "../../lib/keys";

interface Props {
  onBack?: () => void;
  amount?: number;
  reference?: string;
  currency?: string;
  cryptocurrency?: string;
  stellarPublicKey?: string;
}

export default function DepositQRPage({
  onBack,
  amount = 0,
  reference,
  currency = "BOB",
  cryptocurrency,
  stellarPublicKey,
}: Props) {
  /* ───────── estado ───────── */
  const [pubKey, setPubKey] = useState<string | null>(null);
  const [includeAmt, setInc] = useState<boolean>(amount > 0);
  const [amountVal, setAmt] = useState<number>(amount);
  const [qrImg, setQrImg] = useState<string>("");
  const [copied, setCopied] = useState(false);

  /* sync prop→state si cambia la prop amount */
  useEffect(() => setAmt(amount), [amount]);

  /* clave pública */
  useEffect(() => {
    (async () => {
      if (stellarPublicKey) return setPubKey(stellarPublicKey);
      const stored = await getPublicKey();
      if (stored) setPubKey(stored);
    })();
  }, [stellarPublicKey]);

  /* genera QR cuando cambia cualquier dependencia */
  useEffect(() => {
    if (!pubKey) return;

    let url = pubKey;
    if (includeAmt && amountVal > 0) {
      const curr = cryptocurrency || currency;
      url += `?amount=${amountVal}&currency=${curr}`;
      if (reference) url += `&memo=${encodeURIComponent(reference)}`;
    }

    QRCode.toDataURL(url, { width: 280, margin: 2 })
      .then(setQrImg)
      .catch(console.error);
  }, [pubKey, includeAmt, amountVal, currency, cryptocurrency, reference]);

  /* copiar dirección */
  const copy = async () => {
    if (!pubKey) return;
    await navigator.clipboard.writeText(pubKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const displayCurr = cryptocurrency || currency;

  /* ───────── interfaz ───────── */
  return (
    <div className="deposit-qr-full-screen">
      <main className="deposit-qr-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Código QR de depósito</h1>
          <div className="w-10" />
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-6 flex flex-col items-center space-y-6 overflow-y-auto">
          {/* Toggle + Input */}
          <div className="w-full space-y-3">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* switch */}
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
                {includeAmt && amountVal > 0 ? `${amountVal} ${displayCurr}` : "Cantidad flexible"}
              </span>
            </label>

            
          </div>

          {/* QR */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            {qrImg ? (
              <Image src={qrImg} alt="QR" width={280} height={280} className="mx-auto" />
            ) : (
              <div className="w-[280px] h-[280px] bg-gray-100 grid place-items-center rounded-xl">
                <div className="animate-spin w-8 h-8 border-2 border-[#2A906F] border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Wallet Address */}
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
        </section>

        {/* Footer */}
        <footer className="p-4 bg-white">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-3xl font-medium bg-gray-100 text-[#1C2317] hover:bg-gray-200 transition-colors"
          >
            Listo
          </button>
        </footer>
      </main>

      {/* estilos fijos para pantalla completa */}
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

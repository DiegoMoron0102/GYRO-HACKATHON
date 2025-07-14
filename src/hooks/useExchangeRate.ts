"use client";

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';

interface ExchangeRateResponse {
  blue: {
    buy: number;
    sell: number;
  };
}

interface UseExchangeRateReturn {
  buyRate: number;
  sellRate: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshRate: () => Promise<void>;
}

export function useExchangeRate(): UseExchangeRateReturn {
  const [buyRate, setBuyRate] = useState<number>(14.66); // Valor por defecto
  const [sellRate, setSellRate] = useState<number>(14.73); // Valor por defecto
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    const isNative = Capacitor.isNativePlatform();

    const URL = isNative
    ? "https://www.dolarbluebolivia.click/api/exchange_currencies"
    : "/api/rate-proxy"; // ← usar siempre el proxy en web

    try {
      let data: ExchangeRateResponse;

      if (isNative) {
        const res = await Http.get({
          url: URL,
          headers: { 'Content-Type': 'application/json' },
          params: {}, // ← obligatorio aunque esté vacío
        });
        data = res.data as ExchangeRateResponse;
      } else {
        const res = await fetch(URL);
        if (!res.ok) throw new Error("Error al obtener tasa de cambio");
        data = await res.json();
      }

      if (
        data?.blue &&
        typeof data.blue.buy === "number" &&
        typeof data.blue.sell === "number"
      ) {
        setBuyRate(data.blue.sell + 0.30);   // Bs → USDT (compra)
        setSellRate(data.blue.buy + 0.30);   // USDT → Bs (venta)
        setLastUpdated(new Date());
        console.log("✅ Tasa blue actualizada:", data.blue);
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      console.error("❌ Error obteniendo tasa blue:", msg);
      console.log("📌 Usando tasas por defecto:", { buyRate, sellRate });
    } finally {
      setLoading(false);
    }
  }, [buyRate, sellRate]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  useEffect(() => {
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000); // cada 5 minutos
    return () => clearInterval(interval);
  }, [fetchExchangeRate]);

  return {
    buyRate,
    sellRate,
    loading,
    error,
    lastUpdated,
    refreshRate: fetchExchangeRate,
  };
}

/* ───── Helpers ───── */
export const convertUSDTToBS = (usdt: number, sellRate: number): number => usdt * sellRate;
export const convertBSToUSDT = (bs: number, buyRate: number): number => bs / buyRate;

export const formatCurrency = (amount: number, currency: 'USDT' | 'BS'): string =>
  currency === 'USDT'
    ? `${amount.toFixed(2)} USDT`
    : `${amount.toFixed(2)} Bs`;

export const formatExchangeRate = (rate: number): string =>
  `1 USDT = ${rate.toFixed(2)} Bs`;

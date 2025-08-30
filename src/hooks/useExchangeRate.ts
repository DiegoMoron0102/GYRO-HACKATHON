"use client";

import { useState, useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { Http } from "@capacitor-community/http";

interface ExchangeRateResponse {
  blue: {
    buy: number;
    sell: number;
  };
}

export function useExchangeRate() {
  const [buyRate, setBuyRate] = useState(14.66);
  const [sellRate, setSellRate] = useState(14.73);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    const isNative = Capacitor.isNativePlatform();
    // En web: siempre al proxy local, sin headers extra
    const url = isNative
      ? "https://www.dolarbluebolivia.click/api/exchange_currencies"
      : `${window.location.origin}/api/rate-proxy`;

    console.log("🔍 Fetching exchange rate from:", url);

    try {
      let data: ExchangeRateResponse;

      if (isNative) {
        const res = await Http.get({ url });
        data = res.data as ExchangeRateResponse;
      } else {
        const res = await fetch(url);
        console.log("↩️  HTTP status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      }

      if (data.blue && typeof data.blue.buy === "number" && typeof data.blue.sell === "number") {
        setBuyRate(data.blue.sell + 0.3);
        setSellRate(data.blue.buy + 0.3);
        setLastUpdated(new Date());
        console.log("✅ Tasa blue:", data.blue);
      } else {
        throw new Error("Formato inesperado");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("❌ Error obteniendo tasa blue:", msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchExchangeRate]);

  return { buyRate, sellRate, loading, error, lastUpdated, refreshRate: fetchExchangeRate };
}

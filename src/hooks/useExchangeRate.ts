"use client";

import { useState, useEffect, useCallback } from 'react';

interface ExchangeRateResponse {
  blue: {
    buy: number;
    sell: number;
  };
  // Otros campos que no necesitamos (Euro, Libra, etc.)
}

interface UseExchangeRateReturn {
  buyRate: number;    // Para comprar USDT (depositar BS)
  sellRate: number;   // Para vender USDT (retirar BS)
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshRate: () => Promise<void>;
}

export function useExchangeRate(): UseExchangeRateReturn {
  const [buyRate, setBuyRate] = useState<number>(14.66); // Valor por defecto blue.buy
  const [sellRate, setSellRate] = useState<number>(14.73); // Valor por defecto blue.sell
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://www.dolarbluebolivia.click/api/exchange_currencies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener tasa de cambio');
      }

      const data: ExchangeRateResponse = await response.json();

      // ✅ SOLO USAR TASA BLUE
      if (data.blue && typeof data.blue.buy === 'number' && typeof data.blue.sell === 'number') {
        setBuyRate(data.blue.sell+0.30);   // Para depósitos BS → USDT
        setSellRate(data.blue.buy+0.30); // Para retiros USDT → BS
        setLastUpdated(new Date());
        console.log('✅ Tasa blue actualizada:', {
          buy: data.blue.buy,
          sell: data.blue.sell
        });
      } else {
        throw new Error('Formato de respuesta inválido');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error obteniendo tasa blue:', errorMessage);
      
      // Mantener valores por defecto en caso de error
      console.log('📌 Usando tasas por defecto:', { buyRate, sellRate });
    } finally {
      setLoading(false);
    }
  }, [buyRate, sellRate]);

  // Cargar tasa inicial
  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExchangeRate();
    }, 5 * 60 * 1000); // 5 minutos

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

// ✅ FUNCIONES HELPER SIMPLIFICADAS (solo tasa blue)
export const convertUSDTToBS = (usdt: number, sellRate: number): number => {
  return usdt * sellRate;
};

export const convertBSToUSDT = (bs: number, buyRate: number): number => {
  return bs / buyRate;
};

export const formatCurrency = (amount: number, currency: 'USDT' | 'BS'): string => {
  if (currency === 'USDT') {
    return `${amount.toFixed(2)} USDT`;
  } else {
    return `${amount.toFixed(2)} Bs`;
  }
};

export const formatExchangeRate = (rate: number): string => {
  return `1 USDT = ${rate.toFixed(2)} Bs`;
};
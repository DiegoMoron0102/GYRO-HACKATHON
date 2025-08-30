"use client";

import { useCallback, useState, useEffect } from 'react';

// Interfaces para tipos de respuesta del contrato
interface SimulationResponse {
  simulation?: {
    result: number | { value: number } | number[];
  };
}
import { Client } from "@packages/gyro/src/index";
import { getGyroConfig } from "../lib/contractConfig";

interface UseContractBalanceProps {
  userAddress?: string;
  assetType?: "USDC" | "Bs";
  refreshKey?: number; // Key para forzar refrescar
}

export function useContractBalance({ 
  userAddress, 
  assetType = "USDC",
  refreshKey
}: UseContractBalanceProps = {}) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    console.log("🔄 useContractBalance: fetchBalance called", { userAddress, assetType });
    
    if (!userAddress) {
      console.log("❌ useContractBalance: No userAddress provided");
      setBalance(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔗 useContractBalance: Creating contract client...");
      
      // Crear cliente del contrato
      const gyroConfig = getGyroConfig();
      const client = new Client({
        contractId: gyroConfig.contractId,
        networkPassphrase: gyroConfig.networkPassphrase,
        rpcUrl: gyroConfig.rpcUrl,
      });

      // Convertir assetType a formato del contrato
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contractAssetType: any = assetType === "USDC" 
        ? { tag: "USDC", values: void 0 }
        : { tag: "Bs", values: void 0 };

      console.log("💰 useContractBalance: Calling get_user_balance", { userAddress, contractAssetType });

      // Obtener balance del contrato
      const result = await client.get_user_balance({
        user: userAddress,
        asset_type: contractAssetType,
      });

      console.log("📊 useContractBalance: Result received", result);

      // Mejorar el parsing de la respuesta para manejar diferentes formatos
      let finalBalance = 0;
      
      if (result && typeof result === 'object') {
        if (result.result !== undefined) {
          if (typeof result.result === 'number') {
            finalBalance = result.result;
          } else if (result.result && typeof (result.result as unknown as { value: number }).value === 'number') {
            finalBalance = (result.result as unknown as { value: number }).value;
          } else if (Array.isArray(result.result) && result.result.length > 0) {
            finalBalance = result.result[0];
          }
        }
        // Si result es directamente la respuesta de simulación
        else if ((result as SimulationResponse).simulation && (result as SimulationResponse).simulation?.result) {
          const simResult = (result as SimulationResponse).simulation?.result;
          if (typeof simResult === 'number') {
            finalBalance = simResult;
          } else if (simResult && typeof (simResult as unknown as { value: number }).value === 'number') {
            finalBalance = (simResult as unknown as { value: number }).value;
          }
        }
      } else if (typeof result === 'number') {
        finalBalance = result;
      }

      console.log("✅ useContractBalance: Setting balance to", finalBalance);
      setBalance(finalBalance);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("❌ useContractBalance: Error", err);
      setError(msg);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [userAddress, assetType]);

  useEffect(() => {
    console.log("🔄 useContractBalance: useEffect triggered", { refreshKey });
    fetchBalance();
  }, [fetchBalance, refreshKey]); // Agregar refreshKey como dependencia

  const refreshBalance = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { 
    balance, 
    loading, 
    error, 
    refreshBalance 
  };
} 
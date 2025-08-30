import { useState, useEffect, useCallback } from 'react';
import { depositServiceSmart } from '@/lib/depositServiceSmart';

// Interfaz para transacciones del contrato
interface ContractTransaction {
  amount: number;
  asset_type: { tag: string };
  date: string;
  from: string;
  to: string;
  transaction_type: { tag: string };
  tx_id: string;
}

interface UseTransactionHistoryProps {
  userAddress?: string;
}

export const useTransactionHistory = ({ userAddress }: UseTransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<ContractTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!userAddress) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📋 Obteniendo historial de transacciones del smart contract...');
      console.log('👤 Usuario:', userAddress);

      // Obtener transacciones reales del smart contract
      const contractTransactions = await depositServiceSmart.getTransactionHistory(userAddress);
      console.log('🔍 Transacciones del contrato:', contractTransactions);

      // Las transacciones ya vienen en el formato correcto del contrato
      setTransactions(contractTransactions as ContractTransaction[]);
      console.log('✅ Historial cargado:', contractTransactions.length, 'transacciones');

    } catch (err) {
      console.error('❌ Error obteniendo historial del smart contract:', err);
      setError('No se pudieron cargar las transacciones del smart contract.');
      
      // En caso de error, establecer array vacío
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refreshHistory = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refreshHistory
  };
}; 
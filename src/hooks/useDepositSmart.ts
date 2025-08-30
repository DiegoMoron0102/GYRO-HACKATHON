"use client";

import { useState, useCallback } from 'react';
import { depositServiceSmart, DepositRequest, UserInfo } from '../lib/depositServiceSmart';

export interface UseDepositSmartReturn {
  // Estados
  loading: boolean;
  error: string | null;
  success: boolean;
  
  // Datos
  userInfo: UserInfo | null;
  depositHistory: unknown[];
  
  // Funciones
  checkUserInfo: (publicKey: string) => Promise<void>;
  processDeposit: (request: DepositRequest) => Promise<void>;
  getDepositHistory: (publicKey: string) => Promise<void>;
  checkBalance: (publicKey: string) => Promise<number>;
  resetState: () => void;
}

export const useDepositSmart = (): UseDepositSmartReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [depositHistory, setDepositHistory] = useState<unknown[]>([]);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const checkUserInfo = useCallback(async (publicKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const info = await depositServiceSmart.getUserInfo(publicKey);
      setUserInfo(info);
      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verificando información del usuario');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const processDeposit = useCallback(async (request: DepositRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await depositServiceSmart.processDeposit(request);
      
      if (result.success) {
        setSuccess(true);
        // Actualizar información del usuario después del depósito exitoso
        setTimeout(async () => {
          await checkUserInfo(request.userPublicKey);
        }, 1000); // Esperar un poco para que se confirme en blockchain
      } else {
        setError(result.message);
        setSuccess(false);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando depósito');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [checkUserInfo]);

  const getDepositHistory = useCallback(async (publicKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const history = await depositServiceSmart.getTransactionHistory(publicKey);
      setDepositHistory(history);
      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo historial');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkBalance = useCallback(async (publicKey: string): Promise<number> => {
    try {
      return await depositServiceSmart.checkBalance(publicKey);
    } catch (err) {
      console.error('Error verificando balance:', err);
      return 0;
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    success,
    
    // Datos
    userInfo,
    depositHistory,
    
    // Funciones
    checkUserInfo,
    processDeposit,
    getDepositHistory,
    checkBalance,
    resetState,
  };
};

"use client";

import { useState, useCallback } from 'react';
import { depositService, DepositRequest, UserAccountInfo } from '../lib/depositService';

export interface UseDepositReturn {
  // Estados
  loading: boolean;
  error: string | null;
  success: boolean;
  
  // Datos
  userAccountInfo: UserAccountInfo | null;
  adminBalance: { usdc: string; xlm: string } | null;
  depositHistory: unknown[];
  
  // Funciones
  checkUserAccount: (publicKey: string) => Promise<void>;
  createUserAccount: (publicKey: string) => Promise<void>;
  establishTrustline: (secretKey: string) => Promise<void>;
  processDeposit: (request: DepositRequest) => Promise<void>;
  getDepositHistory: (publicKey: string) => Promise<void>;
  getAdminBalance: () => Promise<void>;
  resetState: () => void;
}

export const useDeposit = (): UseDepositReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userAccountInfo, setUserAccountInfo] = useState<UserAccountInfo | null>(null);
  const [adminBalance, setAdminBalance] = useState<{ usdc: string; xlm: string } | null>(null);
  const [depositHistory, setDepositHistory] = useState<unknown[]>([]);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const checkUserAccount = useCallback(async (publicKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const info = await depositService.checkUserAccount(publicKey);
      setUserAccountInfo(info);
      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verificando cuenta');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUserAccount = useCallback(async (publicKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await depositService.createUserAccount(publicKey);
      
      if (result.success) {
        setSuccess(true);
        // Actualizar información de la cuenta
        await checkUserAccount(publicKey);
      } else {
        setError(result.error || 'Error creando cuenta');
        setSuccess(false);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando cuenta');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [checkUserAccount]);

  const establishTrustline = useCallback(async (secretKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await depositService.establishTrustline(secretKey);
      
      if (result.success) {
        setSuccess(true);
        // Actualizar información de la cuenta
        if (result.userAccount) {
          await checkUserAccount(result.userAccount);
        }
      } else {
        setError(result.error || 'Error estableciendo trustline');
        setSuccess(false);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error estableciendo trustline');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [checkUserAccount]);

  const getAdminBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const balance = await depositService.getAdminBalance();
      setAdminBalance(balance);
      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo balance admin');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const processDeposit = useCallback(async (request: DepositRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await depositService.processDeposit(request);
      
      if (result.success) {
        setSuccess(true);
        // Actualizar información de la cuenta
        await checkUserAccount(request.userPublicKey);
        // Actualizar balance admin
        await getAdminBalance();
      } else {
        setError(result.error || 'Error procesando depósito');
        setSuccess(false);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando depósito');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [checkUserAccount, getAdminBalance]);

  const getDepositHistory = useCallback(async (publicKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const history = await depositService.getDepositHistory(publicKey);
      setDepositHistory(history);
      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo historial');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    success,
    
    // Datos
    userAccountInfo,
    adminBalance,
    depositHistory,
    
    // Funciones
    checkUserAccount,
    createUserAccount,
    establishTrustline,
    processDeposit,
    getDepositHistory,
    getAdminBalance,
    resetState,
  };
}; 
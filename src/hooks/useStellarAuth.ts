"use client";

import { useState, useCallback } from "react";
import { Keypair } from "@stellar/stellar-sdk";

interface UseStellarAuthProps {
  userAddress?: string;
}

export function useStellarAuth({ userAddress }: UseStellarAuthProps = {}) {
  const [secretKey, setSecretKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = useCallback((secret: string) => {
    try {
      // Validar que la clave secreta sea válida
      const keypair = Keypair.fromSecret(secret);
      
      // Verificar que la dirección pública coincida
      if (userAddress && keypair.publicKey() !== userAddress) {
        throw new Error("La clave secreta no corresponde a la dirección del usuario");
      }

      setSecretKey(secret);
      setIsAuthenticated(true);
      return { success: true, keypair };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Clave secreta inválida";
      return { success: false, error: msg };
    }
  }, [userAddress]);

  const getKeypair = useCallback(() => {
    if (!secretKey) return null;
    try {
      return Keypair.fromSecret(secretKey);
    } catch {
      return null;
    }
  }, [secretKey]);

  const clearAuth = useCallback(() => {
    setSecretKey("");
    setIsAuthenticated(false);
  }, []);

  return {
    authenticate,
    getKeypair,
    isAuthenticated,
    clearAuth,
    secretKey
  };
} 
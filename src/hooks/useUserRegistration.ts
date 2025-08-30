"use client";

import { useState, useCallback } from "react";
import { Client, networks } from "@packages/user/src/index";

interface UseUserRegistrationProps {
  userAddress?: string;
}

export function useUserRegistration({ userAddress }: UseUserRegistrationProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const registerUser = useCallback(async () => {
    if (!userAddress) {
      setError("No se proporcionó dirección de usuario");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("🔍 Registrando usuario:", userAddress);

      // Crear cliente del contrato de usuario
      const client = new Client({
        contractId: networks.testnet.contractId,
        networkPassphrase: networks.testnet.networkPassphrase,
        rpcUrl: "https://soroban-testnet.stellar.org",
      });

      console.log("✅ Cliente de usuario creado con contractId:", networks.testnet.contractId);

      // Registrar usuario
      const result = await client.register_user({
        user: userAddress,
      });

      console.log("✅ Resultado del registro:", result);

      if (result.result) {
        setSuccess(true);
        setIsRegistered(true);
        console.log("🎉 Usuario registrado exitosamente:", userAddress);
      } else {
        throw new Error("El registro no se completó correctamente");
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("❌ Error registrando usuario:", msg);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  const checkRegistration = useCallback(async () => {
    if (!userAddress) {
      setIsRegistered(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Verificando registro de usuario:", userAddress);

      // Crear cliente del contrato de usuario
      const client = new Client({
        contractId: networks.testnet.contractId,
        networkPassphrase: networks.testnet.networkPassphrase,
        rpcUrl: "https://soroban-testnet.stellar.org",
      });

      // Verificar si el usuario está registrado
      const result = await client.is_user({
        user: userAddress,
      });

      console.log("✅ Resultado de verificación:", result);

      if (result.result !== undefined) {
        setIsRegistered(result.result);
        console.log("📋 Usuario registrado:", result.result);
      } else {
        setIsRegistered(false);
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("❌ Error verificando registro:", msg);
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setIsRegistered(null);
  }, []);

  return {
    registerUser,
    checkRegistration,
    loading,
    error,
    success,
    isRegistered,
    reset
  };
} 
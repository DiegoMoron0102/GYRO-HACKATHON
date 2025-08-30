import { useState, useCallback } from 'react';
import { convertBOBtoUSDC } from '../lib/adminConfig';
import { withdrawServiceSmart } from '../lib/withdrawServiceSmart';
import { getUserData, getSecretKey, saveSecretKey } from '../utils/secureStorage';
import { getSecretKey as getSecretKeyByAddress } from '../utils/secretKeyManager';

interface UseWithdrawProps {
  userAddress: string;
  onWithdrawSuccess?: () => void;
}

export const useWithdraw = ({ userAddress, onWithdrawSuccess }: UseWithdrawProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdraw = useCallback(async (bobAmount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando retiro real con smart contract...');
      console.log('📊 Monto BOB:', bobAmount);
      console.log('👤 Usuario:', userAddress);

      // Validar monto
      if (bobAmount <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      // Convertir BOB a USDC
      const usdcAmount = convertBOBtoUSDC(bobAmount);
      console.log('💱 Monto USDC a retirar:', usdcAmount);

      // Obtener las claves del usuario desde el almacenamiento seguro
      console.log('🔍 Intentando obtener datos del usuario...');
      console.log('🔍 Debug: userAddress recibido:', userAddress);
      
      const userData = await getUserData();
      const userSecretKey = await getSecretKey();
      
      console.log('🔍 Debug getUserData result:', userData ? 'Found' : 'Not found');
      console.log('🔍 Debug getSecretKey result:', userSecretKey ? 'Found' : 'Not found');
      
      // Debug: verificar qué claves existen en localStorage
      console.log('🔍 Debug localStorage keys:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('secret') || key.includes('gyro') || key.includes('Key'))) {
          console.log(`  - ${key}: ${localStorage.getItem(key) ? 'exists' : 'null'}`);
        }
      }
      
      // Intentar múltiples métodos de recuperación de secret key
      let finalSecretKey = userSecretKey;
      
      // Método 1: Desde el almacenamiento seguro (ya lo intentamos arriba)
      if (!finalSecretKey) {
        console.log('⚠️ Secret key no encontrada en almacenamiento seguro, intentando secretKeyManager...');
        console.log('🔍 Debug: buscando clave para userAddress:', userAddress);
        console.log('🔍 Debug: clave esperada en localStorage:', `gyro_secret_key_${userAddress}`);
        
        // Método 2: Usando el secretKeyManager con la dirección del usuario
        const secretKeyByAddress = getSecretKeyByAddress(userAddress);
        console.log('🔍 Debug: secretKeyByAddress result:', secretKeyByAddress ? 'Found' : 'Not found');
        
        if (secretKeyByAddress) {
          console.log('✅ Secret key encontrada con secretKeyManager');
          finalSecretKey = secretKeyByAddress;
          
          // Migrar automáticamente al almacenamiento seguro
          try {
            await saveSecretKey(secretKeyByAddress);
            console.log('✅ Secret key migrada al almacenamiento seguro');
          } catch (migrationError) {
            console.error('❌ Error al migrar secret key:', migrationError);
          }
        }
      }
      
      // Método 3: Fallback a localStorage genérico (legacy)
      if (!finalSecretKey) {
        console.log('⚠️ Secret key no encontrada con secretKeyManager, intentando localStorage genérico...');
        const fallbackSecretKey = localStorage.getItem('secretKey');
        if (fallbackSecretKey) {
          console.log('✅ Secret key encontrada en localStorage genérico, migrando...');
          finalSecretKey = fallbackSecretKey;
          
          // Migrar automáticamente al almacenamiento seguro
          try {
            await saveSecretKey(fallbackSecretKey);
            console.log('✅ Secret key migrada exitosamente');
          } catch (migrationError) {
            console.error('❌ Error al migrar secret key:', migrationError);
          }
        }
      }
      
      if (!userData && !localStorage.getItem('gyro_user')) {
        throw new Error('No se encontraron datos del usuario. Por favor, vuelve a iniciar sesión.');
      }
      
      if (!finalSecretKey) {
        throw new Error('No se encontraron las claves del usuario. Por favor, vuelve a iniciar sesión.');
      }

      console.log('✅ Claves del usuario obtenidas correctamente');

      // Procesar retiro real usando el smart contract
      const result = await withdrawServiceSmart.processWithdraw({
        userPublicKey: userAddress,
        userSecretKey: finalSecretKey,
        amount: usdcAmount,
        description: `Retiro de ${bobAmount} BOB equivalente a ${usdcAmount} USDC`
      });

      if (result.success) {
        console.log('✅ Retiro completado exitosamente:', result);
        console.log('📈 Balance después del retiro:', result.balanceAfter);
        console.log('🔗 Hash de transacción:', result.transactionHash);
        onWithdrawSuccess?.();
      } else {
        throw new Error(result.message);
      }

    } catch (err) {
      console.error('❌ Error en retiro:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido en retiro');
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, onWithdrawSuccess]);

  return {
    withdraw,
    isLoading,
    error
  };
};
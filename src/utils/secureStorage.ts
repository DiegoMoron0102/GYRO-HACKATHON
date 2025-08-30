/**
 * Almacenamiento seguro unificado para móvil
 * Usa Capacitor Secure Storage en móvil y localStorage en web
 */

import { Capacitor } from '@capacitor/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

// Claves para el almacenamiento
const STORAGE_KEYS = {
  USER_DATA: 'gyro_user_data',
  PUBLIC_KEY: 'gyro_public_key', 
  SECRET_KEY: 'gyro_secret_key',
  KYC_STATUS: 'gyro_kyc_status',
  SIMULATED_BALANCE: 'gyro_simulated_balance',
  USER_ADDRESS: 'gyro_user_address'
} as const;

/**
 * Interfaz para datos de usuario
 */
export interface UserData {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
  stellarPublicKey: string;
}

/**
 * Guarda un valor en almacenamiento seguro
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await SecureStoragePlugin.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error saving to secure storage: ${key}`, error);
    throw error;
  }
}

/**
 * Obtiene un valor del almacenamiento seguro
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      const result = await SecureStoragePlugin.get({ key });
      return result.value || null;
    } else {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error(`Error reading from secure storage: ${key}`, error);
    return null;
  }
}

/**
 * Elimina un valor del almacenamiento seguro
 */
export async function removeSecureItem(key: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      await SecureStoragePlugin.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing from secure storage: ${key}`, error);
  }
}

/**
 * Verifica si existe un valor en el almacenamiento
 */
export async function hasSecureItem(key: string): Promise<boolean> {
  try {
    const value = await getSecureItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking secure storage: ${key}`, error);
    return false;
  }
}

/**
 * Guarda los datos del usuario de forma segura
 */
export async function saveUserData(userData: UserData): Promise<void> {
  try {
    const dataString = JSON.stringify(userData);
    await setSecureItem(STORAGE_KEYS.USER_DATA, dataString);
    
    // También guardar la clave pública por separado para acceso rápido
    await setSecureItem(STORAGE_KEYS.PUBLIC_KEY, userData.stellarPublicKey);
    await setSecureItem(STORAGE_KEYS.USER_ADDRESS, userData.stellarPublicKey);
    
    console.log('✅ User data saved securely');
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    throw error;
  }
}

/**
 * Recupera los datos del usuario
 */
export async function getUserData(): Promise<UserData | null> {
  try {
    const dataString = await getSecureItem(STORAGE_KEYS.USER_DATA);
    if (!dataString) return null;
    
    const userData = JSON.parse(dataString) as UserData;
    console.log('✅ User data loaded from secure storage');
    return userData;
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    return null;
  }
}

/**
 * Guarda la secret key de forma segura
 */
export async function saveSecretKey(secretKey: string): Promise<void> {
  try {
    await setSecureItem(STORAGE_KEYS.SECRET_KEY, secretKey);
    console.log('✅ Secret key saved securely');
  } catch (error) {
    console.error('❌ Error saving secret key:', error);
    throw error;
  }
}

/**
 * Recupera la secret key
 */
export async function getSecretKey(): Promise<string | null> {
  try {
    return await getSecureItem(STORAGE_KEYS.SECRET_KEY);
  } catch (error) {
    console.error('❌ Error loading secret key:', error);
    return null;
  }
}

/**
 * Guarda el estado KYC
 */
export async function saveKYCStatus(completed: boolean): Promise<void> {
  try {
    await setSecureItem(STORAGE_KEYS.KYC_STATUS, completed.toString());
    console.log(`✅ KYC status saved: ${completed}`);
  } catch (error) {
    console.error('❌ Error saving KYC status:', error);
    throw error;
  }
}

/**
 * Verifica el estado KYC
 */
export async function getKYCStatus(): Promise<boolean> {
  try {
    const status = await getSecureItem(STORAGE_KEYS.KYC_STATUS);
    return status === 'true';
  } catch (error) {
    console.error('❌ Error loading KYC status:', error);
    return false;
  }
}

/**
 * Guarda el balance simulado
 */
export async function saveSimulatedBalance(balance: number): Promise<void> {
  try {
    await setSecureItem(STORAGE_KEYS.SIMULATED_BALANCE, balance.toFixed(2));
  } catch (error) {
    console.error('❌ Error saving simulated balance:', error);
    throw error;
  }
}

/**
 * Recupera el balance simulado
 */
export async function getSimulatedBalance(): Promise<number> {
  try {
    const balance = await getSecureItem(STORAGE_KEYS.SIMULATED_BALANCE);
    return balance ? parseFloat(balance) : 0;
  } catch (error) {
    console.error('❌ Error loading simulated balance:', error);
    return 0;
  }
}

/**
 * Obtiene la dirección del usuario
 */
export async function getUserAddress(): Promise<string | null> {
  try {
    return await getSecureItem(STORAGE_KEYS.USER_ADDRESS);
  } catch (error) {
    console.error('❌ Error loading user address:', error);
    return null;
  }
}

/**
 * Limpia todos los datos almacenados (logout)
 */
export async function clearAllSecureData(): Promise<void> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map(key => removeSecureItem(key)));
    console.log('✅ All secure data cleared');
  } catch (error) {
    console.error('❌ Error clearing secure data:', error);
    throw error;
  }
}

/**
 * Migra datos existentes de localStorage a almacenamiento seguro
 */
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    console.log('🔄 Starting migration from localStorage to secure storage...');
    
    // Migrar datos de usuario
    const existingUserData = localStorage.getItem('gyro_user');
    if (existingUserData) {
      const userData = JSON.parse(existingUserData) as UserData;
      await saveUserData(userData);
      localStorage.removeItem('gyro_user');
      console.log('✅ User data migrated');
    }
    
    // Migrar clave pública
    const existingPublicKey = localStorage.getItem('publicKey');
    if (existingPublicKey) {
      await setSecureItem(STORAGE_KEYS.PUBLIC_KEY, existingPublicKey);
      localStorage.removeItem('publicKey');
      console.log('✅ Public key migrated');
    }
    
    // Migrar secret key
    const existingSecretKey = localStorage.getItem('secretKey');
    if (existingSecretKey) {
      await saveSecretKey(existingSecretKey);
      localStorage.removeItem('secretKey');
      console.log('✅ Secret key migrated');
    }
    
    // Migrar estado KYC
    const existingKYC = localStorage.getItem('kyc_completed');
    if (existingKYC) {
      await saveKYCStatus(existingKYC === 'true');
      localStorage.removeItem('kyc_completed');
      console.log('✅ KYC status migrated');
    }
    
    // Migrar balance simulado
    const existingBalance = localStorage.getItem('simulatedBalance');
    if (existingBalance) {
      await saveSimulatedBalance(parseFloat(existingBalance));
      localStorage.removeItem('simulatedBalance');
      console.log('✅ Simulated balance migrated');
    }
    
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

export { STORAGE_KEYS };

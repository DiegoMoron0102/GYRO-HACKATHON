/**
 * Utilidades para manejar secret keys de Stellar
 * Solo para MVP - En producción usaríamos un wallet seguro
 */

export const SECRET_KEY_PREFIX = "gyro_secret_key_";

/**
 * Guarda la secret key de un usuario en localStorage
 */
export function saveSecretKey(publicKey: string, secretKey: string): void {
  if (!publicKey || !secretKey) {
    throw new Error("Public key y secret key son requeridos");
  }
  
  const key = `${SECRET_KEY_PREFIX}${publicKey}`;
  localStorage.setItem(key, secretKey);
}

/**
 * Recupera la secret key de un usuario desde localStorage
 */
export function getSecretKey(publicKey: string): string | null {
  if (!publicKey) {
    return null;
  }
  
  const key = `${SECRET_KEY_PREFIX}${publicKey}`;
  return localStorage.getItem(key);
}

/**
 * Elimina la secret key de un usuario
 */
export function removeSecretKey(publicKey: string): void {
  if (!publicKey) {
    return;
  }
  
  const key = `${SECRET_KEY_PREFIX}${publicKey}`;
  localStorage.removeItem(key);
}

/**
 * Verifica si existe una secret key para un usuario
 */
export function hasSecretKey(publicKey: string): boolean {
  return getSecretKey(publicKey) !== null;
}

/**
 * Lista todas las secret keys almacenadas (solo para debugging)
 */
export function listStoredSecretKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SECRET_KEY_PREFIX)) {
      const publicKey = key.replace(SECRET_KEY_PREFIX, "");
      keys.push(publicKey);
    }
  }
  return keys;
} 
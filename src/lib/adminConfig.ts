// Configuración de la cuenta admin con liquidez
export const ADMIN_CONFIG = {
  // Nueva cuenta admin generada para testnet
  PUBLIC_KEY: "GBHHQYYP6JMNBVDF5Y6JM3E3MMQFJNIFSOTSLYJFPKVWWYEQK2OR35J7",
  SECRET_KEY: "SCDARVMZO4B3K4G4AL7HJZGEU2GNHQRDJ6SKDLRFMKPQC26DABN7W6XL",
  
  // Configuración de la red
  NETWORK: "testnet",
  
  // Configuración de depósitos
  AUTO_APPROVE_DEPOSITS: true,
  MIN_DEPOSIT_AMOUNT: 1, // BOB
  MAX_DEPOSIT_AMOUNT: 10000, // BOB
  
  // Tasa de cambio BOB → USDC (aproximada)
  EXCHANGE_RATE: 0.145, // 1 BOB = 0.145 USDC
  
  // Configuración USDC
  USDC_ISSUER: "GDOFS6F4HXNB4LLNYWBYWF2TCRDZGEJD3WJPJXE5WSW3FNQTLADQ3RIW",
  USDC_ASSET_CODE: "USDC",
  
  // Configuración de distribución
  USDC_DISTRIBUTION_AMOUNT: 100, // USDC por usuario
  AUTO_DISTRIBUTE_USDC: true,
};

// Función para obtener las keys del admin
export const getAdminKeys = () => {
  return {
    publicKey: ADMIN_CONFIG.PUBLIC_KEY,
    secretKey: ADMIN_CONFIG.SECRET_KEY
  };
};

// Función para verificar si una dirección es admin
export const isAdminAddress = (address: string): boolean => {
  return address === ADMIN_CONFIG.PUBLIC_KEY;
};

// Función para convertir BOB a USDC
export const convertBOBtoUSDC = (bobAmount: number): number => {
  return Math.floor(bobAmount * ADMIN_CONFIG.EXCHANGE_RATE);
}; 
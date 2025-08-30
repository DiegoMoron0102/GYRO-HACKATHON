// Configuración de contratos desplegados
export const CONTRACT_CONFIG = {
  // Contract IDs reales
  GYRO_CONTRACT_ID: "CABAJD3QPGW76KFVNXGJDTYVV5YO5O2XKC5OD3SDGZODZC6DKH4VORDN",
  USER_CONTRACT_ID: "CDS2VX4DF5ALL7G2X3UHVWXEHLFOLMU7U46YD7XYEBLFZE4ML3VNQUEU",
  
  // Configuración de red
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
  RPC_URL: "https://soroban-testnet.stellar.org",
  
  // Configuración de transacciones
  DEFAULT_FEE: 1000000,
  DEFAULT_TIMEOUT: 30,
};

// Función para obtener configuración del contrato Gyro
export const getGyroConfig = () => {
  return {
    contractId: CONTRACT_CONFIG.GYRO_CONTRACT_ID,
    networkPassphrase: CONTRACT_CONFIG.NETWORK_PASSPHRASE,
    rpcUrl: CONTRACT_CONFIG.RPC_URL,
  };
};

// Función para obtener configuración del contrato User
export const getUserConfig = () => {
  return {
    contractId: CONTRACT_CONFIG.USER_CONTRACT_ID,
    networkPassphrase: CONTRACT_CONFIG.NETWORK_PASSPHRASE,
    rpcUrl: CONTRACT_CONFIG.RPC_URL,
  };
}; 
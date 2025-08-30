/**
 * Script de prueba para verificar la funcionalidad de retiro
 * usando el smart contract existente
 */

import { withdrawServiceSmart } from './src/lib/withdrawServiceSmart';

// Configuración de prueba (usa las mismas llaves que en adminConfig)
const TEST_CONFIG = {
  // Usuario de prueba (debería tener balance en el contrato)
  USER_PUBLIC_KEY: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', // Placeholder
  USER_SECRET_KEY: 'SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', // Placeholder
  WITHDRAW_AMOUNT: 10 // USDC a retirar
};

async function testWithdraw() {
  console.log('🧪 Iniciando prueba de retiro...');
  console.log('===============================');

  try {
    // 1. Verificar balance inicial
    console.log('1️⃣ Verificando balance inicial...');
    const initialBalance = await withdrawServiceSmart.checkUserBalance(TEST_CONFIG.USER_PUBLIC_KEY);
    console.log(`💰 Balance inicial: ${initialBalance} USDC`);

    if (initialBalance < TEST_CONFIG.WITHDRAW_AMOUNT) {
      console.log('❌ Balance insuficiente para realizar la prueba');
      console.log(`💡 Balance requerido: ${TEST_CONFIG.WITHDRAW_AMOUNT} USDC`);
      return;
    }

    // 2. Procesar retiro
    console.log('2️⃣ Procesando retiro...');
    const withdrawResult = await withdrawServiceSmart.processWithdraw({
      userPublicKey: TEST_CONFIG.USER_PUBLIC_KEY,
      userSecretKey: TEST_CONFIG.USER_SECRET_KEY,
      amount: TEST_CONFIG.WITHDRAW_AMOUNT,
      description: 'Prueba de retiro desde script'
    });

    if (withdrawResult.success) {
      console.log('✅ Retiro exitoso!');
      console.log(`📄 Mensaje: ${withdrawResult.message}`);
      console.log(`🔗 TX Hash: ${withdrawResult.transactionHash}`);
      console.log(`💰 Balance después: ${withdrawResult.balanceAfter} USDC`);
    } else {
      console.log('❌ Error en retiro:');
      console.log(`📄 Mensaje: ${withdrawResult.message}`);
    }

    // 3. Verificar historial de transacciones
    console.log('3️⃣ Verificando historial...');
    const withdrawHistory = await withdrawServiceSmart.getWithdrawHistory(TEST_CONFIG.USER_PUBLIC_KEY);
    console.log(`📊 Retiros en historial: ${withdrawHistory.length}`);

  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }

  console.log('===============================');
  console.log('🏁 Prueba de retiro completada');
}

// Función para mostrar instrucciones de uso
function showInstructions() {
  console.log('📋 INSTRUCCIONES PARA PRUEBA DE RETIRO');
  console.log('=====================================');
  console.log('');
  console.log('Para probar la funcionalidad de retiro:');
  console.log('');
  console.log('1. Actualiza TEST_CONFIG con claves reales de un usuario que tenga balance');
  console.log('2. Asegúrate de que el usuario tenga al menos 10 USDC en el contrato');
  console.log('3. Ejecuta: npm run test-withdraw');
  console.log('');
  console.log('⚠️  IMPORTANTE: Usa solo claves de testnet, nunca de mainnet');
  console.log('');
  console.log('🔧 Para usuarios reales:');
  console.log('- Primero haz un depósito usando la app web');
  console.log('- Luego obtén las claves del almacenamiento seguro del dispositivo');
  console.log('- Finalmente ejecuta el retiro desde la app web');
  console.log('');
}

// Ejecutar según el argumento
const arg = process.argv[2];
if (arg === '--test') {
  testWithdraw();
} else {
  showInstructions();
}

export { testWithdraw, showInstructions };

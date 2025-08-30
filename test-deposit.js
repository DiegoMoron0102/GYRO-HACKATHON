// Test script to send deposit to specific account
import { depositServiceSmart } from './src/lib/depositServiceSmart.js';

async function testDeposit() {
  try {
    console.log('🚀 Iniciando test de depósito...');
    
    const request = {
      userPublicKey: 'GD2OSCLESZ4TNASMRNFFSFGHA4UUDV3CAO7674IRDKOBHETIYFB6Y4IM',
      amount: 25,
      description: 'Test deposit from script'
    };

    console.log('📝 Solicitud de depósito:', request);

    // Primero verificar información del usuario
    console.log('\n🔍 Verificando información del usuario...');
    const userInfo = await depositServiceSmart.getUserInfo(request.userPublicKey);
    console.log('👤 Info del usuario:', userInfo);

    // Realizar el depósito
    console.log('\n💰 Procesando depósito...');
    const result = await depositServiceSmart.processDeposit(request);
    console.log('✅ Resultado:', result);

    // Verificar el nuevo balance
    console.log('\n🔍 Verificando nuevo balance...');
    const newBalance = await depositServiceSmart.checkBalance(request.userPublicKey);
    console.log('💰 Nuevo balance:', newBalance);

  } catch (error) {
    console.error('❌ Error en test:', error);
  }
}

testDeposit();

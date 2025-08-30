// Test script para verificar el historial de transacciones
import { depositServiceSmart } from './src/lib/depositServiceSmart';

async function testTransactionHistory() {
  try {
    console.log('📋 Probando historial de transacciones...');
    
    const userAddress = 'GD2OSCLESZ4TNASMRNFFSFGHA4UUDV3CAO7674IRDKOBHETIYFB6Y4IM';
    
    console.log('🔍 Obteniendo historial para:', userAddress);
    const history = await depositServiceSmart.getTransactionHistory(userAddress);
    
    console.log('📄 Historial obtenido:');
    console.log('- Número de transacciones:', history.length);
    
    if (history.length > 0) {
      console.log('- Primera transacción:', history[0]);
      console.log('- Última transacción:', history[history.length - 1]);
    }
    
    // También verificar el balance actual
    console.log('\n💰 Verificando balance actual...');
    const balance = await depositServiceSmart.checkBalance(userAddress);
    console.log('- Balance:', balance, 'USDC');

  } catch (error) {
    console.error('❌ Error en test de historial:', error);
  }
}

testTransactionHistory();

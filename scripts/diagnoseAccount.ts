import { Horizon, Keypair } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function diagnoseAccount() {
  try {
    console.log('🔍 Diagnóstico de cuenta de usuario...\n');
    
    // Usar la cuenta que se creó en el test anterior
    const testUserPublicKey = 'GBFWKIOBYX6YT5OTMUSMV24KUTWHNG7LCY7HNCT736ZMKON7NL6VD2LQ';
    
    console.log('👤 Usuario:', testUserPublicKey);
    
    try {
      const userAccount = await server.loadAccount(testUserPublicKey);
      
      console.log('✅ Cuenta encontrada y activa');
      console.log('📅 Sequence:', userAccount.sequence);
      
      // Verificar balances
      console.log('\n💰 Balances:');
      userAccount.balances.forEach((balance, index) => {
        if (balance.asset_type === 'native') {
          console.log(`   ${index + 1}. XLM: ${balance.balance}`);
        } else if (balance.asset_type === 'credit_alphanum4') {
          console.log(`   ${index + 1}. ${balance.asset_code}: ${balance.balance}`);
          console.log(`      Issuer: ${balance.asset_issuer}`);
        }
      });
      
      // Verificar operaciones recientes
      console.log('\n📊 Operaciones recientes:');
      const operations = await server.operations()
        .forAccount(testUserPublicKey)
        .limit(5)
        .call();
      
      operations.records.forEach((op, index) => {
        console.log(`   ${index + 1}. Tipo: ${op.type}`);
        console.log(`      Hash: ${op.transaction_hash}`);
        console.log(`      Ledger: ${op.ledger_attr}`);
      });
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ Cuenta no encontrada');
      } else {
        console.log('❌ Error:', error.message);
      }
    }
    
    // Verificar transacciones recientes
    console.log('\n🔗 Transacciones recientes:');
    try {
      const payments = await server.payments()
        .forAccount(testUserPublicKey)
        .limit(5)
        .call();
      
      payments.records.forEach((payment, index) => {
        console.log(`   ${index + 1}. Tipo: ${payment.type}`);
        if (payment.asset_type === 'native') {
          console.log(`      XLM: ${payment.amount}`);
        } else if (payment.asset_type === 'credit_alphanum4') {
          console.log(`      ${payment.asset_code}: ${payment.amount}`);
        }
        console.log(`      Hash: ${payment.transaction_hash}`);
      });
      
    } catch (error) {
      console.log('❌ Error obteniendo transacciones:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

diagnoseAccount(); 
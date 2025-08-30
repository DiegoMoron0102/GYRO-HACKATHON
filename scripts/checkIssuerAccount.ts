import { Horizon } from '@stellar/stellar-sdk';

// USDC issuers en testnet
const USDC_ISSUERS = [
  'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7',
  'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVBL4O6X7AZTJNDQJXKB',
  'GA2G73STMVVBWBKD3EFQ2LRWQXTF54AQZEX2TE2EOPCK7EXTLPDDSIX'
];

const testnetServer = new Horizon.Server('https://horizon-testnet.stellar.org');

async function checkIssuerAccounts() {
  try {
    console.log('🔍 Verificando cuentas de issuers de USDC en testnet...\n');
    
    for (const issuer of USDC_ISSUERS) {
      console.log(`🏦 Verificando issuer: ${issuer}`);
      
      try {
        const account = await testnetServer.loadAccount(issuer);
        console.log('✅ Cuenta encontrada');
        console.log(`💰 Balance XLM: ${account.balances.find(b => b.asset_type === 'native')?.balance || '0'}`);
        
        // Verificar si tiene USDC configurado
        const usdcAsset = account.balances.find(
          balance => balance.asset_type === 'credit_alphanum4' && 
                     balance.asset_code === 'USDC'
        );
        
        if (usdcAsset) {
          console.log('🎉 ¡USDC configurado!');
          console.log(`   Balance USDC: ${usdcAsset.balance}`);
          if ('asset_issuer' in usdcAsset) {
            console.log(`   Issuer: ${usdcAsset.asset_issuer}`);
          }
        } else {
          console.log('⚠️ No tiene USDC configurado');
        }
        
        // Mostrar todos los assets
        console.log('📊 Assets configurados:');
        account.balances.forEach((balance, index) => {
          if (balance.asset_type === 'credit_alphanum4') {
            console.log(`   ${index + 1}. ${balance.asset_code}: ${balance.balance}`);
            console.log(`      Issuer: ${balance.asset_issuer}`);
          }
        });
        
      } catch (error) {
        if (error instanceof Error) {
          // Check if it's a 404 error
          if ('response' in error && (error as any).response?.status === 404) {
            console.log('❌ Cuenta NO encontrada');
          } else {
            console.log('❌ Error:', error.message);
          }
        } else {
          console.log('❌ Error desconocido:', String(error));
        }
      }
      
      console.log(''); // Línea en blanco
    }
    
    console.log('💡 RECOMENDACIÓN:');
    console.log('• Si ningún issuer existe, necesitas crear uno');
    console.log('• O usar un issuer válido de Circle en testnet');
    console.log('• Ve a: https://faucet.circle.com/ para obtener USDC');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkIssuerAccounts(); 
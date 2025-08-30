import { Horizon } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;
const mainnetServer = new Horizon.Server('https://horizon.stellar.org');

async function checkMainnetAccount() {
  try {
    console.log('🔍 Verificando si la cuenta admin existe en MAINNET...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    
    try {
      const mainnetAccount = await mainnetServer.loadAccount(ADMIN_PUBLIC_KEY);
      console.log('✅ ¡CUENTA ENCONTRADA EN MAINNET!');
      console.log('💰 Balance XLM:', mainnetAccount.balances.find(b => b.asset_type === 'native')?.balance || '0');
      console.log('🔗 Sequence:', mainnetAccount.sequence);
      console.log('📅 Last Modified:', new Date(mainnetAccount.last_modified_ledger * 5 * 1000).toLocaleString());
      
      // Verificar USDC en mainnet
      const usdcBalance = mainnetAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance) {
        console.log('🎉 ¡Ya tiene USDC en mainnet!');
        console.log(`💰 Balance USDC: ${usdcBalance.balance}`);
        if ('asset_issuer' in usdcBalance) {
          console.log('🏦 Issuer USDC:', usdcBalance.asset_issuer);
        }
      } else {
        console.log('⚠️ No tiene USDC en mainnet');
      }
      
      // Mostrar todos los balances
      console.log('\n💰 Todos los balances:');
      mainnetAccount.balances.forEach((balance, index) => {
        if (balance.asset_type === 'native') {
          console.log(`   ${index + 1}. XLM: ${balance.balance}`);
        } else if (balance.asset_type === 'credit_alphanum4') {
          console.log(`   ${index + 1}. ${balance.asset_code}: ${balance.balance}`);
          console.log(`      Issuer: ${balance.asset_issuer}`);
        }
      });
      
      console.log('\n🚨 IMPORTANTE:');
      console.log('• Tu cuenta está en MAINNET (red de producción)');
      console.log('• Para desarrollo, necesitas una cuenta en TESTNET');
      console.log('• NO uses la cuenta de mainnet para pruebas');
      
      console.log('\n💡 SOLUCIÓN:');
      console.log('• Crea una nueva cuenta en testnet para desarrollo');
      console.log('• Ejecuta: npm run create-admin');
      
    } catch (error) {
      if (error instanceof Error) {
        if ('response' in error && (error as any).response?.status === 404) {
          console.log('❌ Cuenta NO encontrada en mainnet tampoco');
          console.log('💡 Esto confirma que la cuenta nunca fue creada');
        } else {
          console.log('❌ Error verificando mainnet:', error.message);
        }
      } else {
        console.log('❌ Error desconocido:', String(error));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkMainnetAccount(); 
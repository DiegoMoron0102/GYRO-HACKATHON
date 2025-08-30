import { Horizon, Keypair } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;
const testnetServer = new Horizon.Server('https://horizon-testnet.stellar.org');

async function checkAfterFaucet() {
  try {
    console.log('🔍 Verificando estado después del faucet de Circle...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    
    const account = await testnetServer.loadAccount(ADMIN_PUBLIC_KEY);
    
    console.log('\n📊 Estado de la cuenta:');
    console.log('✅ Cuenta activa');
    
    // Verificar balances
    console.log('\n💰 Balances:');
    
    account.balances.forEach((balance, index) => {
      if (balance.asset_type === 'native') {
        console.log(`   ${index + 1}. XLM: ${balance.balance}`);
      } else if (balance.asset_type === 'credit_alphanum4') {
        console.log(`   ${index + 1}. ${balance.asset_code}: ${balance.balance}`);
        console.log(`      Issuer: ${balance.asset_issuer}`);
      }
    });
    
    // Verificar si tiene USDC
    const usdcBalance = account.balances.find(
      balance => balance.asset_type === 'credit_alphanum4' && 
                 balance.asset_code === 'USDC'
    );
    
    if (usdcBalance) {
      console.log('\n🎉 ¡USDC obtenido exitosamente del faucet!');
      console.log(`💰 Balance USDC: ${usdcBalance.balance}`);
      if ('asset_issuer' in usdcBalance) {
        console.log(`🏦 Issuer USDC: ${usdcBalance.asset_issuer}`);
      }
      console.log('✅ Tu cuenta admin está lista para distribuir USDC');
      
      console.log('\n🚀 PRÓXIMOS PASOS:');
      console.log('• Ahora puedes configurar tu sistema para distribuir USDC');
      console.log('• Los trustlines se establecieron automáticamente');
      console.log('• No necesitas configurar nada más manualmente');
      
    } else {
      console.log('\n⚠️ Aún no hay USDC');
      console.log('💡 Ve al faucet de Circle: https://faucet.circle.com/');
      console.log('📝 Ingresa tu public key:', ADMIN_PUBLIC_KEY);
      console.log('🏦 Selecciona USDC y solicita tokens');
      
      console.log('\n⏳ Después de solicitar, espera unos minutos y ejecuta:');
      console.log('npm run check-after-faucet');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAfterFaucet(); 
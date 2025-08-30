import { Horizon, Keypair } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function checkAdminStatus() {
  try {
    console.log('🔍 Verificando estado de la cuenta admin...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    
    const account = await server.loadAccount(ADMIN_PUBLIC_KEY);
    
    console.log('\n📊 Estado de la cuenta:');
    console.log('✅ Cuenta activa');
    
    // Verificar balances
    console.log('\n💰 Balances:');
    
    account.balances.forEach(balance => {
      if (balance.asset_type === 'native') {
        console.log(`   XLM: ${balance.balance}`);
      } else if (balance.asset_type === 'credit_alphanum4') {
        console.log(`   ${balance.asset_code}: ${balance.balance} (Issuer: ${balance.asset_issuer})`);
      }
    });
    
    // Verificar si tiene USDC
    const usdcBalance = account.balances.find(
      balance => balance.asset_type === 'credit_alphanum4' && 
                 balance.asset_code === 'USDC'
    );
    
    if (usdcBalance) {
      console.log('\n🎉 ¡USDC configurado correctamente!');
      console.log(`💰 Balance USDC: ${usdcBalance.balance} USDC`);
      console.log('✅ Listo para distribuir USDC a usuarios');
    } else {
      console.log('\n⚠️ No hay USDC configurado');
      console.log('💡 Ejecuta: npm run setup-admin-usdc');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAdminStatus(); 
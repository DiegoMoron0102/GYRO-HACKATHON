import { Horizon, Keypair } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;

// Servidores de ambas redes
const testnetServer = new Horizon.Server('https://horizon-testnet.stellar.org');
const mainnetServer = new Horizon.Server('https://horizon.stellar.org');

async function checkAdminNetwork() {
  try {
    console.log('🔍 Verificando en qué red existe la cuenta admin...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    
    // Verificar en testnet
    console.log('\n🌐 Verificando en TESTNET...');
    try {
      const testnetAccount = await testnetServer.loadAccount(ADMIN_PUBLIC_KEY);
      console.log('✅ Cuenta encontrada en TESTNET');
      console.log('💰 Balance XLM:', testnetAccount.balances.find(b => b.asset_type === 'native')?.balance || '0');
      
      // Verificar si tiene USDC
      const usdcBalance = testnetAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance) {
        console.log('🎉 ¡Ya tiene USDC en testnet!');
        console.log(`💰 Balance USDC: ${usdcBalance.balance}`);
      } else {
        console.log('⚠️ No tiene USDC en testnet');
      }
      
    } catch (error) {
      console.log('❌ Cuenta NO encontrada en testnet');
    }
    
    // Verificar en mainnet
    console.log('\n🌐 Verificando en MAINNET...');
    try {
      const mainnetAccount = await mainnetServer.loadAccount(ADMIN_PUBLIC_KEY);
      console.log('✅ Cuenta encontrada en MAINNET');
      console.log('💰 Balance XLM:', mainnetAccount.balances.find(b => b.asset_type === 'native')?.balance || '0');
      
      // Verificar si tiene USDC
      const usdcBalance = mainnetAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance) {
        console.log('🎉 ¡Ya tiene USDC en mainnet!');
        console.log(`💰 Balance USDC: ${usdcBalance.balance}`);
      } else {
        console.log('⚠️ No tiene USDC en mainnet');
      }
      
    } catch (error) {
      console.log('❌ Cuenta NO encontrada en mainnet');
    }
    
    // Resumen
    console.log('\n📋 RESUMEN:');
    console.log('• Si la cuenta está en mainnet, necesitas cambiar a testnet para desarrollo');
    console.log('• Si la cuenta está en testnet pero sin USDC, necesitas obtenerlo del faucet');
    console.log('• Si no está en ninguna red, necesitas crearla');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAdminNetwork(); 
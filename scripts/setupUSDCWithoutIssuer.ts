import { 
  Asset, 
  BASE_FEE, 
  Horizon, 
  Keypair, 
  Networks, 
  Operation, 
  TransactionBuilder 
} from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;
const ADMIN_SECRET_KEY = ADMIN_CONFIG.SECRET_KEY;

// Servidor Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function setupUSDCWithoutIssuer() {
  try {
    console.log('🔗 Configurando USDC sin issuer predefinido...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    
    const adminKeypair = Keypair.fromSecret(ADMIN_SECRET_KEY);
    
    // 1. Verificar que la cuenta existe
    console.log('\n🔍 Verificando cuenta...');
    let adminAccount;
    
    try {
      adminAccount = await server.loadAccount(adminKeypair.publicKey());
      console.log('✅ Cuenta encontrada');
      console.log('💰 Balance XLM:', adminAccount.balances.find(b => b.asset_type === 'native')?.balance || '0');
    } catch (error) {
      console.log('❌ Error cargando cuenta:', error.message);
      return;
    }
    
    // 2. Verificar si ya tiene USDC
    console.log('\n🔍 Verificando USDC existente...');
    const hasUSDC = adminAccount.balances.find(
      balance => balance.asset_type === 'credit_alphanum4' && 
                 balance.asset_code === 'USDC'
    );
    
    if (hasUSDC) {
      console.log('✅ Ya tienes USDC configurado');
      console.log(`💰 Balance USDC: ${hasUSDC.balance}`);
      console.log(`🏦 Issuer: ${hasUSDC.asset_issuer}`);
      return;
    }
    
    console.log('⚠️ No tienes USDC configurado');
    
    // 3. Mostrar opciones
    console.log('\n💡 OPCIONES PARA CONFIGURAR USDC:');
    console.log('1. Usar el faucet de Circle (recomendado)');
    console.log('2. Crear un trustline manualmente');
    console.log('3. Verificar si ya tienes USDC del faucet');
    
    // 4. Verificar si ya tienes USDC del faucet
    console.log('\n🔍 Verificando si ya tienes USDC del faucet...');
    
    try {
      // Buscar transacciones recientes que involucren tu cuenta
      const payments = await server.payments()
        .forAccount(adminKeypair.publicKey())
        .limit(20)
        .call();
      
      console.log(`📊 Encontradas ${payments.records.length} transacciones recientes`);
      
      // Buscar transacciones de USDC
      const usdcPayments = payments.records.filter(payment => 
        payment.asset_type === 'credit_alphanum4' && 
        payment.asset_code === 'USDC'
      );
      
      if (usdcPayments.length > 0) {
        console.log('🎉 ¡Encontradas transacciones de USDC!');
        usdcPayments.forEach((payment, index) => {
          console.log(`   ${index + 1}. USDC: ${payment.amount} (Issuer: ${payment.asset_issuer})`);
        });
        
        // El issuer correcto es el de la primera transacción
        const correctIssuer = usdcPayments[0].asset_issuer;
        console.log(`\n🏦 Issuer correcto de USDC: ${correctIssuer}`);
        
        // Actualizar adminConfig.ts
        console.log('\n📝 Actualizando adminConfig.ts...');
        console.log('💡 Copia este issuer y pégalo en adminConfig.ts:');
        console.log(`   USDC_ISSUER: "${correctIssuer}",`);
        
        return;
      } else {
        console.log('⚠️ No se encontraron transacciones de USDC');
      }
      
    } catch (error) {
      console.log('❌ Error verificando transacciones:', error.message);
    }
    
    // 5. Instrucciones para el faucet
    console.log('\n🚀 INSTRUCCIONES PARA EL FAUCET:');
    console.log('1. Ve a: https://faucet.circle.com/');
    console.log('2. Selecciona: Stellar Testnet');
    console.log('3. Ingresa tu public key:', ADMIN_PUBLIC_KEY);
    console.log('4. Selecciona: USDC');
    console.log('5. Solicita tokens');
    console.log('6. Espera unos minutos');
    console.log('7. Ejecuta: npm run check-after-faucet');
    
    console.log('\n💡 DESPUÉS DEL FAUCET:');
    console.log('• El faucet enviará USDC a tu cuenta');
    console.log('• Automáticamente se establecerá el trustline');
    console.log('• Podrás ver el balance de USDC');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupUSDCWithoutIssuer(); 
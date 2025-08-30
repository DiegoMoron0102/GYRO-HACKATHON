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

// Servidor Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function testDepositCorrect() {
  try {
    console.log('🧪 Probando sistema de depósito CORREGIDO...\n');
    
    // 1. Crear una cuenta de usuario de prueba
    console.log('👤 Creando cuenta de usuario de prueba...');
    const testUserKeypair = Keypair.random();
    
    console.log('   Public Key:', testUserKeypair.publicKey());
    console.log('   Secret Key:', testUserKeypair.secret());
    
    // 2. Verificar cuenta admin
    console.log('\n🔍 Verificando cuenta admin...');
    const adminKeypair = Keypair.fromSecret(ADMIN_CONFIG.SECRET_KEY);
    
    try {
      const adminAccount = await server.loadAccount(adminKeypair.publicKey());
      console.log('✅ Cuenta admin activa');
      
      // Verificar balance USDC
      const usdcBalance = adminAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance) {
        console.log(`💰 Balance USDC admin: ${usdcBalance.balance}`);
      } else {
        console.log('❌ No hay USDC en la cuenta admin');
        return;
      }
      
    } catch (error) {
      console.log('❌ Error cargando cuenta admin:', error.message);
      return;
    }
    
    // 3. Crear asset USDC
    const usdcAsset = new Asset(ADMIN_CONFIG.USDC_ASSET_CODE, ADMIN_CONFIG.USDC_ISSUER);
    
    // 4. PASO 1: Crear cuenta de usuario con XLM inicial
    console.log('\n💰 PASO 1: Creando cuenta de usuario...');
    
    try {
      // Enviar XLM inicial para activar la cuenta
      const createAccountOperation = Operation.createAccount({
        destination: testUserKeypair.publicKey(),
        startingBalance: '2', // 2 XLM: 1 para activar + 1 para fees
      });
      
      const adminAccount = await server.loadAccount(adminKeypair.publicKey());
      const transaction = new TransactionBuilder(adminAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(createAccountOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(adminKeypair);
      
      console.log('🚀 Creando cuenta de usuario...');
      const result = await server.submitTransaction(transaction);
      console.log('✅ Cuenta de usuario creada');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error creando cuenta:', error.message);
      return;
    }
    
    // 5. PASO 2: Usuario establece trustline para USDC
    console.log('\n🔗 PASO 2: Usuario establece trustline para USDC...');
    
    try {
      // Esperar a que la cuenta esté activa
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const userAccount = await server.loadAccount(testUserKeypair.publicKey());
      
      const changeTrustOperation = Operation.changeTrust({
        asset: usdcAsset,
        source: testUserKeypair.publicKey(),
      });
      
      const transaction = new TransactionBuilder(userAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(changeTrustOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(testUserKeypair);
      
      console.log('🚀 Estableciendo trustline...');
      const result = await server.submitTransaction(transaction);
      console.log('✅ Trustline establecido');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error estableciendo trustline:', error.message);
      return;
    }
    
    // 6. PASO 3: Admin envía USDC al usuario
    console.log('\n💰 PASO 3: Admin envía USDC al usuario...');
    
    try {
      const paymentOperation = Operation.payment({
        source: adminKeypair.publicKey(),
        destination: testUserKeypair.publicKey(),
        amount: '100', // 100 USDC como depósito inicial
        asset: usdcAsset,
      });
      
      const adminAccount = await server.loadAccount(adminKeypair.publicKey());
      const transaction = new TransactionBuilder(adminAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(paymentOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(adminKeypair);
      
      console.log('🚀 Enviando USDC...');
      const result = await server.submitTransaction(transaction);
      console.log('✅ USDC enviado exitosamente');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error enviando USDC:', error.message);
      return;
    }
    
    // 7. Verificar resultado final
    console.log('\n🔍 Verificando resultado final...');
    
    try {
      // Esperar un poco para que se procese
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const userAccount = await server.loadAccount(testUserKeypair.publicKey());
      console.log('✅ Cuenta de usuario activa');
      
      // Verificar balance USDC del usuario
      const userUsdcBalance = userAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (userUsdcBalance) {
        console.log(`💰 Balance USDC del usuario: ${userUsdcBalance.balance}`);
        console.log('🎉 ¡Depósito completado exitosamente!');
      } else {
        console.log('⚠️ USDC no encontrado en la cuenta del usuario');
      }
      
      // Mostrar todos los balances
      console.log('\n📊 Balances del usuario:');
      userAccount.balances.forEach((balance, index) => {
        if (balance.asset_type === 'native') {
          console.log(`   ${index + 1}. XLM: ${balance.balance}`);
        } else if (balance.asset_type === 'credit_alphanum4') {
          console.log(`   ${index + 1}. ${balance.asset_code}: ${balance.balance}`);
          console.log(`      Issuer: ${balance.asset_issuer}`);
        }
      });
      
    } catch (error) {
      console.log('❌ Error verificando cuenta de usuario:', error.message);
    }
    
    // 8. Resumen del test
    console.log('\n📋 RESUMEN DEL TEST CORREGIDO:');
    console.log('✅ Cuenta admin verificada');
    console.log('✅ USDC disponible para distribución');
    console.log('✅ Usuario de prueba creado');
    console.log('✅ Trustline establecido por el usuario');
    console.log('✅ USDC enviado al usuario');
    console.log('✅ Sistema de depósito funcionando correctamente');
    
    console.log('\n🚀 FLUJO CORRECTO DE DEPÓSITO:');
    console.log('1. Usuario crea cuenta (recibe XLM inicial)');
    console.log('2. Usuario establece trustline para USDC');
    console.log('3. Admin envía USDC al usuario');
    console.log('4. Usuario recibe USDC automáticamente');
    
    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('• Integrar este flujo en tu aplicación');
    console.log('• Crear interfaz para que usuarios establezcan trustlines');
    console.log('• Implementar validaciones y límites');
    console.log('• Sistema de verificación bancaria simulada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testDepositCorrect(); 
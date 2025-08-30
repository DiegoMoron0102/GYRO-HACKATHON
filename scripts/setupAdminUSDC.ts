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

// Configuración
const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;
const ADMIN_SECRET_KEY = ADMIN_CONFIG.SECRET_KEY;

// USDC en testnet (Circle) - Issuer correcto
const USDC_ISSUER = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7';
const USDC_ASSET = new Asset('USDC', USDC_ISSUER);

// Servidor Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function setupAdminUSDC() {
  try {
    console.log('🚀 Configurando cuenta admin para USDC...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    console.log('🏦 USDC Issuer:', USDC_ISSUER);

    // Crear keypair del admin
    const adminKeypair = Keypair.fromSecret(ADMIN_SECRET_KEY);
    
    // 1. Verificar si la cuenta admin existe y tiene XLM
    console.log('\n🔍 Verificando cuenta admin...');
    let adminAccount;
    
    try {
      adminAccount = await server.loadAccount(adminKeypair.publicKey());
      console.log('✅ Cuenta admin encontrada');
      
      // Verificar balance de XLM
      const xlmBalance = adminAccount.balances.find(
        balance => balance.asset_type === 'native'
      );
      
      if (xlmBalance) {
        console.log(`💰 Balance XLM: ${xlmBalance.balance} XLM`);
        
        if (parseFloat(xlmBalance.balance) < 1) {
          console.log('⚠️ Saldo XLM insuficiente. Necesitas al menos 1 XLM para operaciones');
          console.log('🔗 Ve a https://laboratory.stellar.org/#account-creator?network=test');
          console.log('💡 Crea una cuenta con tu public key y fúndala con Friendbot');
          return;
        }
      }
      
    } catch (error) {
      console.log('❌ Cuenta admin no encontrada');
      console.log('🔗 Ve a https://laboratory.stellar.org/#account-creator?network=test');
      console.log('💡 Crea una cuenta con tu public key y fúndala con Friendbot');
      return;
    }

    // 2. Verificar si ya tiene trustline para USDC
    console.log('\n🔗 Verificando trustline USDC...');
    const hasUSDCTrustline = adminAccount.balances.find(
      balance => balance.asset_type === 'credit_alphanum4' && 
                 balance.asset_code === 'USDC'
    );

    if (hasUSDCTrustline) {
      console.log('✅ Trustline USDC ya establecido');
      console.log(`💰 Balance USDC actual: ${hasUSDCTrustline.balance} USDC`);
    } else {
      console.log('⚠️ No hay trustline para USDC');
      console.log('🔗 Estableciendo trustline...');
      
      // Crear operación de trustline
      const changeTrustOperation = Operation.changeTrust({
        asset: USDC_ASSET,
        source: adminKeypair.publicKey(),
      });

      // Construir transacción
      const transaction = new TransactionBuilder(adminAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(changeTrustOperation)
        .setTimeout(30)
        .build();

      // Firmar transacción
      transaction.sign(adminKeypair);

      // Enviar transacción
      const result = await server.submitTransaction(transaction);
      console.log('✅ Trustline USDC establecido exitosamente');
      console.log('🔗 Hash:', result.hash);
      
      // Recargar cuenta
      adminAccount = await server.loadAccount(adminKeypair.publicKey());
    }

    // 3. Obtener USDC del faucet de Circle
    console.log('\n🏦 Obteniendo USDC del faucet de Circle...');
    console.log('🔗 Ve a: https://faucet.circle.com/');
    console.log('💡 Ingresa tu public key:', ADMIN_PUBLIC_KEY);
    console.log('💡 Selecciona USDC y solicita fondos');
    
    // 4. Verificar balance después de obtener USDC
    console.log('\n⏳ Esperando 30 segundos para que se procese la solicitud...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      const updatedAccount = await server.loadAccount(adminKeypair.publicKey());
      const usdcBalance = updatedAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance && parseFloat(usdcBalance.balance) > 0) {
        console.log('🎉 ¡USDC obtenido exitosamente!');
        console.log(`💰 Balance USDC: ${usdcBalance.balance} USDC`);
        console.log('✅ Tu cuenta admin está lista para distribuir USDC');
      } else {
        console.log('⚠️ Aún no se ha recibido USDC');
        console.log('💡 Verifica en el faucet de Circle si la solicitud fue aprobada');
        console.log('💡 Puede tomar algunos minutos en procesarse');
      }
      
    } catch (error) {
      console.log('❌ Error verificando balance actualizado');
    }

  } catch (error) {
    console.error('❌ Error en setup:', error);
  }
}

// Ejecutar script
setupAdminUSDC(); 
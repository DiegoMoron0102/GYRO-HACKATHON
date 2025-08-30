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

async function setupUSDCAsset() {
  try {
    console.log('🔗 Configurando asset USDC personalizado...\n');
    
    // 1. Cargar las keys del archivo temporal
    console.log('📂 Cargando keys del archivo temporal...');
    const fs = require('fs');
    
    if (!fs.existsSync('temp_usdc_keys.json')) {
      console.log('❌ No se encontró el archivo temp_usdc_keys.json');
      console.log('💡 Ejecuta primero: npm run create-usdc-asset');
      return;
    }
    
    const keysData = JSON.parse(fs.readFileSync('temp_usdc_keys.json', 'utf8'));
    const issuerKeypair = Keypair.fromSecret(keysData.issuer.secretKey);
    const distributorKeypair = Keypair.fromSecret(keysData.distributor.secretKey);
    const adminKeypair = Keypair.fromSecret(ADMIN_CONFIG.SECRET_KEY);
    
    console.log('✅ Keys cargadas correctamente');
    console.log('🏦 Issuer:', keysData.issuer.publicKey);
    console.log('📦 Distributor:', keysData.distributor.publicKey);
    console.log('👤 Admin:', ADMIN_CONFIG.PUBLIC_KEY);
    
    // 2. Crear el asset
    const usdcAsset = new Asset(keysData.asset.code, keysData.asset.issuer);
    
    // 3. Verificar que las cuentas existen
    console.log('\n🔍 Verificando cuentas...');
    
    let issuerAccount, distributorAccount;
    
    try {
      issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
      console.log('✅ Cuenta issuer activa');
    } catch (error) {
      console.log('❌ Cuenta issuer no encontrada');
      console.log('💡 Crea la cuenta issuer primero en Stellar Laboratory');
      return;
    }
    
    try {
      distributorAccount = await server.loadAccount(distributorKeypair.publicKey());
      console.log('✅ Cuenta distribuidora activa');
    } catch (error) {
      console.log('❌ Cuenta distribuidora no encontrada');
      console.log('💡 Crea la cuenta distribuidora primero en Stellar Laboratory');
      return;
    }
    
    // 4. Configurar trustline para el distribuidor
    console.log('\n🔗 Configurando trustline para el distribuidor...');
    
    try {
      const changeTrustOperation = Operation.changeTrust({
        asset: usdcAsset,
        source: distributorKeypair.publicKey(),
      });
      
      const transaction = new TransactionBuilder(distributorAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(changeTrustOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(distributorKeypair);
      
      const result = await server.submitTransaction(transaction);
      console.log('✅ Trustline establecido para el distribuidor');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error estableciendo trustline:', error.message);
      return;
    }
    
    // 5. Emitir USDC al distribuidor
    console.log('\n💰 Emitiendo USDC al distribuidor...');
    
    try {
      const paymentOperation = Operation.payment({
        source: issuerKeypair.publicKey(),
        destination: distributorKeypair.publicKey(),
        amount: '1000000', // 1 millón de USDC
        asset: usdcAsset,
      });
      
      const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
      const transaction = new TransactionBuilder(issuerAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(paymentOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(issuerKeypair);
      
      const result = await server.submitTransaction(transaction);
      console.log('✅ USDC emitido al distribuidor');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error emitiendo USDC:', error.message);
      return;
    }
    
    // 6. Configurar trustline para tu cuenta admin
    console.log('\n🔗 Configurando trustline para tu cuenta admin...');
    
    try {
      const adminAccount = await server.loadAccount(adminKeypair.publicKey());
      
      const changeTrustOperation = Operation.changeTrust({
        asset: usdcAsset,
        source: adminKeypair.publicKey(),
      });
      
      const transaction = new TransactionBuilder(adminAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(changeTrustOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(adminKeypair);
      
      const result = await server.submitTransaction(transaction);
      console.log('✅ Trustline establecido para tu cuenta admin');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error estableciendo trustline para admin:', error.message);
      return;
    }
    
    // 7. Enviar USDC a tu cuenta admin
    console.log('\n💰 Enviando USDC a tu cuenta admin...');
    
    try {
      const paymentOperation = Operation.payment({
        source: distributorKeypair.publicKey(),
        destination: adminKeypair.publicKey(),
        amount: '10000', // 10,000 USDC
        asset: usdcAsset,
      });
      
      const updatedDistributorAccount = await server.loadAccount(distributorKeypair.publicKey());
      const transaction = new TransactionBuilder(updatedDistributorAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(paymentOperation)
        .setTimeout(30)
        .build();
      
      transaction.sign(distributorKeypair);
      
      const result = await server.submitTransaction(transaction);
      console.log('✅ USDC enviado a tu cuenta admin');
      console.log('🔗 Hash:', result.hash);
      
    } catch (error) {
      console.log('❌ Error enviando USDC a admin:', error.message);
      return;
    }
    
    // 8. Actualizar adminConfig.ts
    console.log('\n📝 Actualizando adminConfig.ts...');
    console.log('💡 Copia esta configuración en adminConfig.ts:');
    console.log(`   USDC_ISSUER: "${keysData.asset.issuer}",`);
    console.log(`   USDC_ASSET_CODE: "${keysData.asset.code}",`);
    
    // 9. Verificar el resultado
    console.log('\n🔍 Verificando resultado...');
    
    try {
      const finalAdminAccount = await server.loadAccount(adminKeypair.publicKey());
      const usdcBalance = finalAdminAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance) {
        console.log('🎉 ¡USDC configurado exitosamente!');
        console.log(`💰 Balance USDC: ${usdcBalance.balance}`);
        console.log(`🏦 Issuer: ${usdcBalance.asset_issuer}`);
        console.log('✅ Tu cuenta admin está lista para distribuir USDC');
      } else {
        console.log('⚠️ USDC no encontrado en la cuenta admin');
      }
      
    } catch (error) {
      console.log('❌ Error verificando resultado:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

setupUSDCAsset(); 
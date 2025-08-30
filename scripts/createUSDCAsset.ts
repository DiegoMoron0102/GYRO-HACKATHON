import { 
  Asset, 
  BASE_FEE, 
  Horizon, 
  Keypair, 
  Networks, 
  Operation, 
  TransactionBuilder 
} from '@stellar/stellar-sdk';

// Servidor Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function createUSDCAsset() {
  try {
    console.log('🚀 Creando asset USDC personalizado en Stellar testnet...\n');
    
    // 1. Generar cuentas issuer y distribuidora
    console.log('🔑 Generando cuentas...');
    const issuerKeypair = Keypair.random();
    const distributorKeypair = Keypair.random();
    
    console.log('🏦 Issuer Account:');
    console.log('   Public Key:', issuerKeypair.publicKey());
    console.log('   Secret Key:', issuerKeypair.secret());
    
    console.log('\n📦 Distributor Account:');
    console.log('   Public Key:', distributorKeypair.publicKey());
    console.log('   Secret Key:', distributorKeypair.secret());
    
    // 2. Crear el asset
    const usdcAsset = new Asset('USDC', issuerKeypair.publicKey());
    console.log('\n💎 Asset creado:');
    console.log('   Código:', usdcAsset.getCode());
    console.log('   Issuer:', usdcAsset.getIssuer());
    
    // 3. Instrucciones para crear las cuentas
    console.log('\n📋 PASOS PARA CREAR LAS CUENTAS:');
    console.log('1. Ve a: https://laboratory.stellar.org/#account-creator?network=test');
    console.log('2. Crea la cuenta ISSUER:');
    console.log(`   - Public Key: ${issuerKeypair.publicKey()}`);
    console.log(`   - Secret Key: ${issuerKeypair.secret()}`);
    console.log('   - Haz clic en "Fund Account with Friendbot"');
    
    console.log('\n3. Crea la cuenta DISTRIBUTOR:');
    console.log(`   - Public Key: ${distributorKeypair.publicKey()}`);
    console.log(`   - Secret Key: ${distributorKeypair.secret()}`);
    console.log('   - Haz clic en "Fund Account with Friendbot"');
    
    console.log('\n4. Espera a que ambas cuentas estén activas');
    console.log('5. Ejecuta: npm run setup-usdc-asset');
    
    // 4. Guardar las keys en un archivo temporal
    console.log('\n💾 Guardando keys temporalmente...');
    const keysData = {
      issuer: {
        publicKey: issuerKeypair.publicKey(),
        secretKey: issuerKeypair.secret()
      },
      distributor: {
        publicKey: distributorKeypair.publicKey(),
        secretKey: distributorKeypair.secret()
      },
      asset: {
        code: usdcAsset.getCode(),
        issuer: usdcAsset.getIssuer()
      }
    };
    
    // Crear archivo temporal con las keys
    const fs = require('fs');
    fs.writeFileSync('temp_usdc_keys.json', JSON.stringify(keysData, null, 2));
    console.log('✅ Keys guardadas en temp_usdc_keys.json');
    
    console.log('\n⚠️ IMPORTANTE:');
    console.log('• Guarda estas keys en un lugar seguro');
    console.log('• Nunca compartas las secret keys');
    console.log('• Estas cuentas son para TESTNET únicamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createUSDCAsset(); 
import { Keypair } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

async function createAdminAccount() {
  try {
    console.log('🚀 Creando cuenta admin en Stellar testnet...');
    console.log('👤 Public Key:', ADMIN_CONFIG.PUBLIC_KEY);
    console.log('🔑 Secret Key:', ADMIN_CONFIG.SECRET_KEY);

    // Verificar que las keys sean válidas
    const adminKeypair = Keypair.fromSecret(ADMIN_CONFIG.SECRET_KEY);
    
    if (adminKeypair.publicKey() !== ADMIN_CONFIG.PUBLIC_KEY) {
      console.log('❌ Error: Las keys no coinciden');
      return;
    }

    console.log('✅ Keys válidas');

    // URL del Friendbot
    const friendbotUrl = `https://friendbot.stellar.org/?addr=${ADMIN_CONFIG.PUBLIC_KEY}`;
    
    console.log('\n🔗 Friendbot URL:');
    console.log(friendbotUrl);
    
    console.log('\n📋 Pasos para crear la cuenta:');
    console.log('1. Abre el enlace del Friendbot en tu navegador');
    console.log('2. Haz clic en "Get testnet lumens"');
    console.log('3. Espera la confirmación');
    console.log('4. Ejecuta: npm run check-admin');
    
    console.log('\n💡 Alternativa: Ve a https://laboratory.stellar.org/#account-creator?network=test');
    console.log('   Pega tu public key y haz clic en "Fund with Friendbot"');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdminAccount(); 
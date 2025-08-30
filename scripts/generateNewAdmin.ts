import { Keypair } from '@stellar/stellar-sdk';

async function generateNewAdmin() {
  try {
    console.log('🚀 Generando nueva cuenta admin...');
    
    // Generar nuevo keypair
    const newAdminKeypair = Keypair.random();
    
    console.log('\n🔑 NUEVAS KEYS GENERADAS:');
    console.log('👤 Public Key:', newAdminKeypair.publicKey());
    console.log('🔑 Secret Key:', newAdminKeypair.secret());
    
    console.log('\n📋 PASOS PARA CONFIGURAR:');
    console.log('1. Copia estas keys y guárdalas en un lugar seguro');
    console.log('2. Actualiza src/lib/adminConfig.ts con las nuevas keys');
    console.log('3. Ejecuta: npm run create-admin para crear la cuenta');
    console.log('4. Ejecuta: npm run setup-admin-usdc para configurar USDC');
    
    console.log('\n⚠️ IMPORTANTE:');
    console.log('• Guarda la secret key en un lugar seguro');
    console.log('• Nunca compartas la secret key');
    console.log('• Estas keys son para TESTNET únicamente');
    
    console.log('\n💡 PRÓXIMO PASO:');
    console.log('Actualiza adminConfig.ts con estas keys y luego ejecuta:');
    console.log('npm run create-admin');
    
  } catch (error) {
    console.error('❌ Error generando keys:', error);
  }
}

generateNewAdmin(); 
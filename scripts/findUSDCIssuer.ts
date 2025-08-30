import { Horizon } from '@stellar/stellar-sdk';

const testnetServer = new Horizon.Server('https://horizon-testnet.stellar.org');

async function findUSDCIssuer() {
  try {
    console.log('🔍 Buscando issuer correcto de USDC en testnet...\n');
    
    // Buscar transacciones recientes que involucren USDC
    console.log('📊 Buscando transacciones recientes con USDC...');
    
    try {
      // Buscar operaciones de payment con USDC
      const payments = await testnetServer.payments()
        .forAsset('USDC')
        .limit(10)
        .call();
      
      console.log(`✅ Encontradas ${payments.records.length} transacciones con USDC`);
      
      // Extraer issuers únicos
      const issuers = new Set<string>();
      payments.records.forEach(payment => {
        if (payment.asset_type === 'credit_alphanum4' && payment.asset_code === 'USDC') {
          issuers.add(payment.asset_issuer);
        }
      });
      
      console.log('\n🏦 Issuers de USDC encontrados:');
      issuers.forEach((issuer, index) => {
        console.log(`   ${index + 1}. ${issuer}`);
      });
      
      if (issuers.size > 0) {
        console.log('\n💡 RECOMENDACIÓN:');
        console.log('• Usa el primer issuer de la lista');
        console.log('• Actualiza adminConfig.ts con el issuer correcto');
        console.log('• Luego ejecuta: npm run trustline');
      }
      
    } catch (error) {
      console.log('⚠️ No se pudieron encontrar transacciones con USDC');
    }
    
    // Buscar en el explorer de Stellar
    console.log('\n🌐 Alternativa: Verificar en Stellar Explorer');
    console.log('• Ve a: https://testnet.stellarchain.io/');
    console.log('• Busca "USDC" en la barra de búsqueda');
    console.log('• Verifica el issuer de los resultados');
    
    // Buscar en Circle directamente
    console.log('\n🏦 Verificar en Circle:');
    console.log('• Ve a: https://faucet.circle.com/');
    console.log('• Selecciona Stellar Testnet');
    console.log('• Mira si muestra información del issuer');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findUSDCIssuer(); 
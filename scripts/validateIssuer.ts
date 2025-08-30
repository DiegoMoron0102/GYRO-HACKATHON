import { Asset, StrKey } from '@stellar/stellar-sdk';

// Issuers de USDC en testnet
const USDC_ISSUERS = [
  'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVBL4L6X7AZTJNDQJXKB',
  'GA2G73STMVVBWBKD3EFQ2LRWQXTF54AQZEX2TE2EOPCK7EXTLPDDSIX',
  'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5J3K3RGAZ3K7K6PG4YBR',
  'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7'
];

console.log('🔍 Validando issuers de USDC...\n');

USDC_ISSUERS.forEach((issuer, index) => {
  try {
    // Validar formato de la clave pública
    const isValidKey = StrKey.isValidEd25519PublicKey(issuer);
    
    if (isValidKey) {
      // Intentar crear el asset
      const asset = new Asset('USDC', issuer);
      console.log(`✅ Issuer ${index + 1}: ${issuer}`);
      console.log(`   Asset creado: ${asset.getCode()}@${asset.getIssuer()}\n`);
    } else {
      console.log(`❌ Issuer ${index + 1}: ${issuer} - Formato inválido\n`);
    }
  } catch (error) {
    console.log(`❌ Issuer ${index + 1}: ${issuer} - Error: ${error.message}\n`);
  }
});

// Probar con un issuer conocido válido
console.log('🧪 Probando con issuer conocido...');
try {
  const testIssuer = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7';
  const testAsset = new Asset('USDC', testIssuer);
  console.log(`✅ Asset de prueba creado: ${testAsset.getCode()}@${testAsset.getIssuer()}`);
} catch (error) {
  console.log(`❌ Error con asset de prueba: ${error.message}`);
} 
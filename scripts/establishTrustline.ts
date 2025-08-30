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

// USDC en testnet
const USDC_ISSUER = 'GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5J3K3RGAZ3K7K6PG4YBR';
const USDC_ASSET = new Asset('USDC', USDC_ISSUER);

// Servidor Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function establishTrustline() {
  try {
    console.log('🔗 Estableciendo trustline para USDC...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    console.log('🏦 USDC Issuer:', USDC_ISSUER);
    
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
    
    // 2. Verificar si ya tiene trustline
    console.log('\n🔍 Verificando trustline existente...');
    const hasUSDCTrustline = adminAccount.balances.find(
      balance => balance.asset_type === 'credit_alphanum4' && 
                 balance.asset_code === 'USDC'
    );
    
    if (hasUSDCTrustline) {
      console.log('✅ Trustline USDC ya establecido');
      console.log(`💰 Balance USDC: ${hasUSDCTrustline.balance}`);
      return;
    }
    
    // 3. Crear operación de trustline
    console.log('\n🔗 Creando operación de trustline...');
    const changeTrustOperation = Operation.changeTrust({
      asset: USDC_ASSET,
      source: adminKeypair.publicKey(),
    });
    
    // 4. Construir transacción con fee más alto
    console.log('\n📝 Construyendo transacción...');
    const transaction = new TransactionBuilder(adminAccount, {
      fee: BASE_FEE * 2, // Fee más alto para evitar problemas
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(changeTrustOperation)
      .setTimeout(30)
      .build();
    
    // 5. Firmar transacción
    console.log('\n🔐 Firmando transacción...');
    transaction.sign(adminKeypair);
    
    // 6. Enviar transacción
    console.log('\n🚀 Enviando transacción...');
    try {
      const result = await server.submitTransaction(transaction);
      console.log('🎉 ¡Trustline establecido exitosamente!');
      console.log('🔗 Hash de transacción:', result.hash);
      console.log('📅 Ledger:', result.ledger_attr);
      
      // 7. Verificar que se estableció
      console.log('\n🔍 Verificando trustline...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
      
      const updatedAccount = await server.loadAccount(adminKeypair.publicKey());
      const newUSDCTrustline = updatedAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (newUSDCTrustline) {
        console.log('✅ Trustline USDC confirmado');
        console.log(`💰 Balance USDC: ${newUSDCTrustline.balance}`);
        console.log('🎉 ¡Listo para recibir USDC!');
      } else {
        console.log('⚠️ Trustline no confirmado aún');
      }
      
    } catch (error) {
      console.log('❌ Error enviando transacción:');
      
      if (error.response?.data) {
        const errorData = error.response.data;
        console.log('   Tipo:', errorData.type);
        console.log('   Título:', errorData.title);
        console.log('   Detalle:', errorData.detail);
        
        if (errorData.extras?.result_codes) {
          console.log('   Códigos de resultado:');
          console.log('     Operación:', errorData.extras.result_codes.operations);
          console.log('     Transacción:', errorData.extras.result_codes.transaction);
        }
      } else {
        console.log('   Mensaje:', error.message);
      }
      
      // Intentar con fee más alto
      console.log('\n🔄 Intentando con fee más alto...');
      try {
        const highFeeTransaction = new TransactionBuilder(adminAccount, {
          fee: BASE_FEE * 10, // Fee mucho más alto
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(changeTrustOperation)
          .setTimeout(30)
          .build();
        
        highFeeTransaction.sign(adminKeypair);
        
        const highFeeResult = await server.submitTransaction(highFeeTransaction);
        console.log('🎉 ¡Trustline establecido con fee alto!');
        console.log('🔗 Hash:', highFeeResult.hash);
        
      } catch (highFeeError) {
        console.log('❌ Error incluso con fee alto:', highFeeError.message);
        console.log('💡 Intenta manualmente en Stellar Laboratory');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

establishTrustline(); 
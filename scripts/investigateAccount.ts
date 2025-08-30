import { Horizon, Keypair } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

const ADMIN_PUBLIC_KEY = ADMIN_CONFIG.PUBLIC_KEY;
const testnetServer = new Horizon.Server('https://horizon-testnet.stellar.org');

async function investigateAccount() {
  try {
    console.log('🔍 Investigando qué pasó con la cuenta admin...');
    console.log('👤 Admin:', ADMIN_PUBLIC_KEY);
    
    // 1. Verificar si la cuenta existe actualmente
    console.log('\n📊 Verificando estado actual...');
    try {
      const currentAccount = await testnetServer.loadAccount(ADMIN_PUBLIC_KEY);
      console.log('✅ Cuenta EXISTE actualmente en testnet');
      console.log('💰 Balance XLM:', currentAccount.balances.find(b => b.asset_type === 'native')?.balance || '0');
      console.log('🔗 Sequence:', currentAccount.sequence);
      console.log('📅 Last Modified:', new Date(currentAccount.lastModifiedLedger * 5 * 1000).toLocaleString());
      
      // Verificar USDC
      const usdcBalance = currentAccount.balances.find(
        balance => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );
      
      if (usdcBalance) {
        console.log('🎉 ¡Ya tiene USDC!');
        console.log(`💰 Balance USDC: ${usdcBalance.balance}`);
      } else {
        console.log('⚠️ No tiene USDC configurado');
      }
      
      return; // Si la cuenta existe, no necesitamos investigar más
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ Cuenta NO encontrada en testnet (404)');
      } else {
        console.log('❌ Error verificando cuenta:', error.message);
        return;
      }
    }
    
    // 2. Verificar transacciones recientes (si las hay)
    console.log('\n🔍 Verificando transacciones recientes...');
    try {
      const transactions = await testnetServer
        .transactions()
        .forAccount(ADMIN_PUBLIC_KEY)
        .limit(10)
        .call();
      
      if (transactions.records.length > 0) {
        console.log('📝 Transacciones encontradas:', transactions.records.length);
        transactions.records.forEach((tx, index) => {
          console.log(`   ${index + 1}. Hash: ${tx.hash.substring(0, 8)}...`);
          console.log(`      Fecha: ${new Date(tx.created_at).toLocaleString()}`);
          console.log(`      Operaciones: ${tx.operation_count}`);
        });
      } else {
        console.log('📝 No hay transacciones recientes');
      }
      
    } catch (error) {
      console.log('⚠️ No se pudieron obtener transacciones');
    }
    
    // 3. Verificar operaciones recientes
    console.log('\n🔍 Verificando operaciones recientes...');
    try {
      const operations = await testnetServer
        .operations()
        .forAccount(ADMIN_PUBLIC_KEY)
        .limit(10)
        .call();
      
      if (operations.records.length > 0) {
        console.log('⚙️ Operaciones encontradas:', operations.records.length);
        operations.records.forEach((op, index) => {
          console.log(`   ${index + 1}. Tipo: ${op.type}`);
          console.log(`      Fecha: ${new Date(op.created_at).toLocaleString()}`);
          if (op.type === 'payment') {
            console.log(`      Cantidad: ${op.amount} ${op.asset_code || 'XLM'}`);
          }
        });
      } else {
        console.log('⚙️ No hay operaciones recientes');
      }
      
    } catch (error) {
      console.log('⚠️ No se pudieron obtener operaciones');
    }
    
    // 4. Verificar si la cuenta fue eliminada por merge
    console.log('\n🔍 Verificando si la cuenta fue eliminada por merge...');
    try {
      const effects = await testnetServer
        .effects()
        .forAccount(ADMIN_PUBLIC_KEY)
        .limit(20)
        .call();
      
      if (effects.records.length > 0) {
        console.log('📊 Efectos encontrados:', effects.records.length);
        
        // Buscar efectos de eliminación de cuenta
        const accountDeleted = effects.records.find(effect => 
          effect.type === 'account_removed' || 
          effect.type === 'account_merged'
        );
        
        if (accountDeleted) {
          console.log('🚨 ¡CUENTA ELIMINADA!');
          console.log(`   Tipo: ${accountDeleted.type}`);
          console.log(`   Fecha: ${new Date(accountDeleted.created_at).toLocaleString()}`);
        } else {
          console.log('✅ No hay efectos de eliminación de cuenta');
        }
        
        // Mostrar últimos efectos
        effects.records.slice(0, 5).forEach((effect, index) => {
          console.log(`   ${index + 1}. ${effect.type} - ${new Date(effect.created_at).toLocaleString()}`);
        });
      } else {
        console.log('📊 No hay efectos recientes');
      }
      
    } catch (error) {
      console.log('⚠️ No se pudieron obtener efectos');
    }
    
    // 5. Resumen de la investigación
    console.log('\n📋 RESUMEN DE LA INVESTIGACIÓN:');
    console.log('• La cuenta admin NO existe actualmente en testnet');
    console.log('• Esto puede deberse a:');
    console.log('  1. La cuenta nunca fue creada en testnet');
    console.log('  2. La cuenta fue eliminada por merge con otra cuenta');
    console.log('  3. La cuenta fue eliminada por operaciones de limpieza');
    console.log('  4. Problemas de sincronización de la red');
    
    console.log('\n💡 RECOMENDACIONES:');
    console.log('• Ejecuta: npm run create-admin para crear la cuenta');
    console.log('• O ve manualmente a: https://laboratory.stellar.org/#account-creator?network=test');
    
  } catch (error) {
    console.error('❌ Error en investigación:', error);
  }
}

investigateAccount(); 
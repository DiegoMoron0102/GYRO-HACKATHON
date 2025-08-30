const { execSync } = require('child_process');

// Configuración
const ADMIN_PUBLIC_KEY = "GDMPDCOBUG2TQ2URWDJY63FNFDXM7WAVEU7BYSWR7NG3LY2ZE4DH5UI4";
const ADMIN_SECRET_KEY = "SBE76TGS77BSGTHQJM2GEOI2T4FYCTUZWAU6Z24HVZACZLYY2IVIB6XQ";
const USER_CONTRACT_ID = "CANM3T4BWINEPXWFWDIUT7XFX44TGS6AFJMXPNGKFSW6J7UL2422M263";
const GYRO_CONTRACT_ID = "CAOSVKNJ54XTRNLPBS5HBSY2YVIAZYPM2CBQOMLVXOSL7GA6DFRT3AJY";

console.log('🔧 CONFIGURANDO CUENTA ADMIN AUTOMÁTICAMENTE');
console.log('============================================');
console.log('');

function executeCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    console.log(`📝 Comando: ${command}`);
    
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(`✅ ${description} - EXITOSO`);
    console.log(`📋 Resultado: ${result.trim()}`);
    console.log('');
    return result;
  } catch (error) {
    console.log(`❌ ${description} - ERROR`);
    console.log(`📋 Error: ${error.message}`);
    console.log('');
    return null;
  }
}

// 1. Registrar admin como usuario en contrato User
console.log('📋 PASO 1: Registrar admin como usuario');
executeCommand(
  `stellar contract invoke --id ${USER_CONTRACT_ID} --source ${ADMIN_PUBLIC_KEY} --network testnet -- register_user --user ${ADMIN_PUBLIC_KEY}`,
  'Registrando admin como usuario en contrato User'
);

// 2. Agregar admin a la lista de admins (necesita owner)
console.log('📋 PASO 2: Agregar admin a lista de admins');
console.log('⚠️  NOTA: Este paso requiere que el owner del contrato lo ejecute');
console.log(`📝 Comando para owner: stellar contract invoke --id ${USER_CONTRACT_ID} --source [OWNER_ADDRESS] --network testnet -- add_admin --admin ${ADMIN_PUBLIC_KEY}`);
console.log('');

// 3. Registrar balance del admin en contrato Gyro
console.log('📋 PASO 3: Registrar balance del admin en contrato Gyro');
executeCommand(
  `stellar contract invoke --id ${GYRO_CONTRACT_ID} --source ${ADMIN_PUBLIC_KEY} --network testnet -- register_balance --user ${ADMIN_PUBLIC_KEY}`,
  'Registrando balance del admin en contrato Gyro'
);

// 4. Verificar que el admin está registrado
console.log('📋 PASO 4: Verificar registro del admin');
executeCommand(
  `stellar contract invoke --id ${USER_CONTRACT_ID} --source ${ADMIN_PUBLIC_KEY} --network testnet -- is_user --user ${ADMIN_PUBLIC_KEY}`,
  'Verificando si admin está registrado como usuario'
);

console.log('🎉 CONFIGURACIÓN COMPLETADA');
console.log('');
console.log('📋 RESUMEN:');
console.log(`   - Admin Public Key: ${ADMIN_PUBLIC_KEY}`);
console.log(`   - User Contract ID: ${USER_CONTRACT_ID}`);
console.log(`   - Gyro Contract ID: ${GYRO_CONTRACT_ID}`);
console.log('');
console.log('⚠️  PASOS PENDIENTES:');
console.log('   1. El owner debe agregar al admin usando add_admin');
console.log('   2. Transferir liquidez inicial al admin desde el contrato');
console.log(''); 
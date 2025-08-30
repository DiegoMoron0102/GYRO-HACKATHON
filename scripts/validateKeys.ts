import { Keypair, StrKey } from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from '../src/lib/adminConfig';

async function validateKeys() {
  try {
    console.log('🔑 Validando keys del admin...');
    console.log('👤 Public Key:', ADMIN_CONFIG.PUBLIC_KEY);
    console.log('🔑 Secret Key:', ADMIN_CONFIG.SECRET_KEY);
    
    // Validar formato de las keys
    console.log('\n✅ Validando formato...');
    
    const isPublicKeyValid = StrKey.isValidEd25519PublicKey(ADMIN_CONFIG.PUBLIC_KEY);
    const isSecretKeyValid = StrKey.isValidEd25519SecretSeed(ADMIN_CONFIG.SECRET_KEY);
    
    console.log('Public Key válida:', isPublicKeyValid ? '✅' : '❌');
    console.log('Secret Key válida:', isSecretKeyValid ? '✅' : '❌');
    
    if (!isPublicKeyValid || !isSecretKeyValid) {
      console.log('❌ Una o ambas keys tienen formato inválido');
      return;
    }
    
    // Verificar que la secret key genere la public key correcta
    console.log('\n🔐 Verificando correspondencia...');
    
    try {
      const keypair = Keypair.fromSecret(ADMIN_CONFIG.SECRET_KEY);
      const generatedPublicKey = keypair.publicKey();
      
      console.log('Public Key generada:', generatedPublicKey);
      console.log('Public Key configurada:', ADMIN_CONFIG.PUBLIC_KEY);
      
      if (generatedPublicKey === ADMIN_CONFIG.PUBLIC_KEY) {
        console.log('✅ Las keys coinciden correctamente');
      } else {
        console.log('❌ Las keys NO coinciden');
        console.log('💡 La secret key no genera la public key configurada');
      }
      
    } catch (error) {
      console.log('❌ Error generando keypair:', error.message);
    }
    
    // Verificar longitud de las keys
    console.log('\n📏 Verificando longitud...');
    console.log('Public Key (debe ser 56 chars):', ADMIN_CONFIG.PUBLIC_KEY.length);
    console.log('Secret Key (debe ser 56 chars):', ADMIN_CONFIG.SECRET_KEY.length);
    
    if (ADMIN_CONFIG.PUBLIC_KEY.length !== 56) {
      console.log('⚠️ Public Key debe tener exactamente 56 caracteres');
    }
    
    if (ADMIN_CONFIG.SECRET_KEY.length !== 56) {
      console.log('⚠️ Secret Key debe tener exactamente 56 caracteres');
    }
    
    // Verificar que empiecen con G y S respectivamente
    console.log('\n🔍 Verificando prefijos...');
    
    if (!ADMIN_CONFIG.PUBLIC_KEY.startsWith('G')) {
      console.log('⚠️ Public Key debe empezar con G');
    } else {
      console.log('✅ Public Key empieza con G');
    }
    
    if (!ADMIN_CONFIG.SECRET_KEY.startsWith('S')) {
      console.log('⚠️ Secret Key debe empezar con S');
    } else {
      console.log('✅ Secret Key empieza con S');
    }
    
  } catch (error) {
    console.error('❌ Error en validación:', error);
  }
}

validateKeys(); 
// Script para crear la trustline de USDC en la cuenta admin (Stellar Testnet)
// Uso (PowerShell):
//   $env:ADMIN_SECRET="S..."; $env:USDC_ISSUER="G..."; node scripts/addTrustlineUSDC.mjs
// Opcional: $env:ASSET_CODE="USDC" (por defecto USDC)

import pkg from '@stellar/stellar-sdk';
const { Keypair, Networks, Asset, Operation, TransactionBuilder, Horizon } = pkg;

const ADMIN_SECRET = process.env.ADMIN_SECRET;
let USDC_ISSUER = process.env.USDC_ISSUER; // si no viene, intentaremos resolverlo automáticamente
const ASSET_CODE = process.env.ASSET_CODE || 'USDC';

if (!ADMIN_SECRET) throw new Error('Falta ADMIN_SECRET en variables de entorno');

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function resolveIssuer(assetCode) {
  try {
    const url = `https://horizon-testnet.stellar.org/assets?asset_code=${encodeURIComponent(assetCode)}&limit=200`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Horizon respondió ${res.status}`);
    const data = await res.json();
    const list = data?._embedded?.records ?? [];
    if (!list.length) throw new Error('No se encontraron assets con ese código en testnet');

    // Elegimos el issuer con mayor adopción (num_accounts)
    list.sort((a, b) => (b.num_accounts || 0) - (a.num_accounts || 0));
    const best = list[0];
    return best.asset_issuer;
  } catch (e) {
    console.warn('⚠️  No se pudo resolver automáticamente el issuer:', e.message || e);
    return null;
  }
}

async function main() {
  if (!USDC_ISSUER) {
    console.log(`🔎 Resolviendo automáticamente issuer para ${ASSET_CODE} en testnet...`);
    USDC_ISSUER = await resolveIssuer(ASSET_CODE);
    if (!USDC_ISSUER) throw new Error('No se pudo determinar automáticamente el issuer. Define USDC_ISSUER.');
    console.log('✅ Issuer detectado:', USDC_ISSUER);
  }
  const admin = Keypair.fromSecret(ADMIN_SECRET);
  console.log('🔑 Admin:', admin.publicKey());
  console.log('🏦 Issuer', ASSET_CODE + ':', USDC_ISSUER);

  // Cargar cuenta y verificar si ya existe la trustline
  const load = async () => server.loadAccount(admin.publicKey());
  let account = await load();

  const already = account.balances?.some(
    (b) => b.asset_code === ASSET_CODE && b.asset_issuer === USDC_ISSUER,
  );
  if (already) {
    console.log(`✅ La trustline ${ASSET_CODE}:${USDC_ISSUER} ya existe.`);
    return;
  }

  const fee = await server.fetchBaseFee();
  const asset = new Asset(ASSET_CODE, USDC_ISSUER);

  const tx = new TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.changeTrust({
        asset,
      }),
    )
    .setTimeout(60)
    .build();

  tx.sign(admin);
  console.log('✍️  Enviando transacción de change_trust...');
  const res = await server.submitTransaction(tx);
  console.log('✅ Trustline creada. Hash:', res.hash);

  // Confirmar resultado
  account = await load();
  const nowExists = account.balances?.some(
    (b) => b.asset_code === ASSET_CODE && b.asset_issuer === USDC_ISSUER,
  );
  if (nowExists) {
    console.log(`🎉 Confirmado: ${ASSET_CODE} añadido a la cuenta.`);
  } else {
    console.log('⚠️  No se encontró la trustline tras enviar la transacción. Verifica en Horizon.');
  }
}

main().catch((err) => {
  console.error('❌ Error creando trustline:', err);
  process.exit(1);
});


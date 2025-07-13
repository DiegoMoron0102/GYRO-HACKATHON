import {
  Horizon,
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  Networks,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import { loadSecret } from './keys';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

/** Verifica si la cuenta está creada en testnet y devuelve balance (XLM) si existe */
export async function checkAccountExists(
  publicKey: string
): Promise<{ exists: boolean; balance: string }> {
  
    const acc = await server.loadAccount(publicKey);
    const bal =
      acc.balances.find((b) => b.asset_type === 'native')?.balance ?? '0';
    return { exists: true, balance: bal };
  } 


/** Devuelve el balance en XLM (string) sin ambigüedad de tipo */
export async function getBalance(publicKey: string): Promise<string> {
  const { balance } = await checkAccountExists(publicKey);
  return balance; // siempre string
}

export async function sendPayment(
  pin: string,
  destination: string,
  amount: string,
  memoText?: string,
) {
  const secret = await loadSecret(pin);
  const sourceKeypair = Keypair.fromSecret(secret);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
    memo: memoText ? Memo.text(memoText) : undefined,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      }),
    )
    .setTimeout(60)
    .build();

  tx.sign(sourceKeypair);
  const res = await server.submitTransaction(tx);
  return res.hash;
}

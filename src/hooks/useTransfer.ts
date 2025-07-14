"use client";

import { useState } from "react";
import { Keypair, Networks, TransactionBuilder } from "@stellar/stellar-sdk";
import { Client as GyroClient } from "@packages/gyro/src";
import { useSorobanReact } from "@soroban-react/core";

interface TransferArgs {
  from: string;
  to: string;
  amount: number;
  date: string;
  tx_id: string;
  asset_type: { tag: "USDC"; values: undefined };
  secretKey: string;
}

export function useTransfer() {
  const { activeChain } = useSorobanReact();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transfer = async ({
    from,
    to,
    amount,
    date,
    tx_id,
    asset_type,
    secretKey,
  }: TransferArgs) => {
    const chain = activeChain ?? {
      networkPassphrase: Networks.TESTNET,
      sorobanRpcUrl: "https://soroban-testnet.stellar.org",
    };

    setLoading(true);
    setError(null);

    try {
      const gyroClient = new GyroClient({
        contractId: "CAOSVKNJ54XTRNLPBS5HBSY2YVIAZYPM2CBQOMLVXOSL7GA6DFRT3AJY",
        networkPassphrase: chain.networkPassphrase,
        rpcUrl: chain.sorobanRpcUrl!,
      });

      const tx = await gyroClient.transfer(
        { from, to, amount, date, tx_id, asset_type },
        { fee: 1_000_000, timeoutInSeconds: 30 }
      );

      await tx.simulate(); // simulación antes de firmar

      const signedResult = await tx.signAndSend({
        signTransaction: async (xdr: string) => {
          const stellarTx = TransactionBuilder.fromXDR(xdr, chain.networkPassphrase);
          stellarTx.sign(Keypair.fromSecret(secretKey));
          return {
            signedTxXdr: stellarTx.toXDR(),
            signerAddress: Keypair.fromSecret(secretKey).publicKey(),
          };
        },
      });

      setLoading(false);
      return signedResult;
    } catch (e: unknown) {
      console.error("❌ useTransfer error:", e);
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      throw e;
    }
  };

  return { transfer, loading, error };
}

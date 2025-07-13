import { useCallback, useState } from "react";
import { useSorobanReact } from "@soroban-react/core";
import { Client as UserClient, networks } from "@packages/user/src";

import { Keypair, Networks, Transaction } from "@stellar/stellar-sdk";

const sponsorSecret = "SCEHNF6KZQ5ZGRDMHJ2DEKSQAJ7XLXJYYPMHIOWSOLI2VDCEEV6UOOFU";
const sponsorKeypair = Keypair.fromSecret(sponsorSecret);



export function useRegisterUserWithSponsor() {
  const { server } = useSorobanReact();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const register = useCallback(
    async (userAddress: string) => {
      if (!server) throw new Error("RPC no inicializado");

      const { networkPassphrase, contractId } = networks.testnet;
      const contract = new UserClient({
        rpcUrl: server.serverURL,
        networkPassphrase,
        contractId
      });

      setLoading(true);
      setError(null);

      try {
        // 1. Simula (opcional pero recomendable)
        await contract.register_user({ user: userAddress }, { simulate: true });

        // 2. Prepara la transacción real (AssembledTransaction)
        const tx = await contract.register_user({ user: userAddress });

        // 3. Firma y envía usando signAndSend con objeto de opciones
        const sentTx = await tx.signAndSend({
          signTransaction: async (txXDR: string, opts?: { networkPassphrase?: string }) => {
        const networkPassphrase = opts?.networkPassphrase || Networks.TESTNET;
        const txObj = new Transaction(txXDR, networkPassphrase);
        txObj.sign(sponsorKeypair);
        return {
            signedTxXdr: txObj.toXDR(),
            signerAddress: sponsorKeypair.publicKey()
        };
        }


          // Puedes añadir force: true para evitar otra simulación si lo deseas
        });
            
        // 4. Lee el resultado de la transacción
        setLoading(false);
        return sentTx.result;
      } catch (e) {
        setLoading(false);
        setError(e);
        throw e;
      }
    },
    [server]
  );

  return { register, loading, error };
}

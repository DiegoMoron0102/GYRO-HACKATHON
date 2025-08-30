"use client";

import { useState } from "react";
import {
  Keypair,
  Networks,
  TransactionBuilder
} from "@stellar/stellar-sdk";

import { Client as UserClient } from "@packages/user/src";
import { Client as BalanceClient } from "@packages/gyro/src";
import { useSorobanReact } from "@soroban-react/core";

/* IDs de contrato */
const USER_CONTRACT_ID = "CDS2VX4DF5ALL7G2X3UHVWXEHLFOLMU7U46YD7XYEBLFZE4ML3VNQUEU";
const BALANCE_CONTRACT_ID = "CABAJD3QPGW76KFVNXGJDTYVV5YO5O2XKC5OD3SDGZODZC6DKH4VORDN";

interface RegisterArgs {
  pin: string;
  name: string;
  email: string;
}

export function useRegisterUserProgrammatic() {
  const { activeChain } = useSorobanReact();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({ name, email }: RegisterArgs) => {
    const chain = activeChain ?? {
      networkPassphrase: Networks.TESTNET,
      sorobanRpcUrl: "https://soroban-testnet.stellar.org"
    };

    setLoading(true);
    setError(null);

    try {
      const kp = Keypair.random();
      const publicKey = kp.publicKey();
      const secretKey = kp.secret();
      console.log("🔑 Created account:", publicKey);

      const fb = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      if (!fb.ok) throw new Error("Friendbot no pudo fondear la cuenta.");

      console.log("💰 Account funded successfully");
      await new Promise(resolve => setTimeout(resolve, 3000));

      const common = {
        networkPassphrase: chain.networkPassphrase,
        rpcUrl: chain.sorobanRpcUrl!
      };

      const userClient = new UserClient({
        contractId: USER_CONTRACT_ID,
        publicKey, // 💥 el invocador de la tx es el mismo que `user`
        ...common
      });

      const balanceClient = new BalanceClient({
        contractId: BALANCE_CONTRACT_ID,
        publicKey,
        ...common
      });

      console.log("📝 Starting user registration...");
      const txUser = await userClient.register_user(
        { user: publicKey },
        {
          fee: 1_000_000,
          timeoutInSeconds: 30
        }
      );

      // 🔐 Simular antes de firmar
      await txUser.simulate();

      const resUser = await txUser.signAndSend({
        signTransaction: async (xdr: string) => {
          const tx = TransactionBuilder.fromXDR(xdr, chain.networkPassphrase);
          tx.sign(Keypair.fromSecret(secretKey));
          console.log("🧾 Signatures on tx:", tx.signatures.map(sig => sig.hint().toString("hex")));
          return {
            signedTxXdr: tx.toXDR(),
            signerAddress: publicKey
          };
        }
      });

      console.log("✅ User registered successfully:", resUser.result);

      console.log("💼 Starting balance registration...");
      const txBal = await balanceClient.register_balance(
        { user: publicKey },
        {
          fee: 1_000_000,
          timeoutInSeconds: 30
        }
      );

      await txBal.simulate();

      const resBal = await txBal.signAndSend({
        signTransaction: async (xdr: string) => {
          const tx = TransactionBuilder.fromXDR(xdr, chain.networkPassphrase);
          tx.sign(Keypair.fromSecret(secretKey));
          return {
            signedTxXdr: tx.toXDR(),
            signerAddress: publicKey
          };
        }
      });

      console.log("✅ Balance registered successfully:", resBal.result);
      // Guardar datos en localStorage para el MVP no se usara en producción
      localStorage.setItem("publicKey", publicKey);
      localStorage.setItem("secretKey", secretKey);
      
      setLoading(false);
      return {
        publicKey,
        secretKey,
        name,
        email,
        stellarPublicKey: publicKey,
        createdAt: new Date().toISOString(),
        userTxResult: resUser.result,
        balanceTxResult: resBal.result
      };
    } catch (e: unknown) {
      console.error("❌ useRegisterUser error:", e);
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      throw e;
    }
  };

  return { register, loading, error };
}

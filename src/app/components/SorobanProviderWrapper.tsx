"use client";
import { SorobanReactProvider } from "@soroban-react/core";   // ⬅️ sin WalletChain
import { freighter }            from "@soroban-react/freighter";
import { xbull }                from "@soroban-react/xbull";

/**
 * El provider sólo valida que cada chain tenga:
 *  id · networkPassphrase · networkUrl · rpcUrl
 * (network y los icon* son opcionales)
 */
const chains = [
  {
    id: "testnet",
    name: "Stellar Testnet",
    network: "testnet",
    networkPassphrase: "Test SDF Network ; September 2015",
    networkUrl: "https://horizon-testnet.stellar.org",
    sorobanRpcUrl: "https://soroban-testnet.stellar.org"  
  }
];

const connectors = [freighter(), xbull()];

export default function SorobanProviderWrapper(
  { children }: { children: React.ReactNode }
) {
  return (
    <SorobanReactProvider chains={chains} connectors={connectors}>
      {children}
    </SorobanReactProvider>
  );
}

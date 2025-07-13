"use client";
import { SorobanReactProvider } from "@soroban-react/core";
import { freighter } from "@soroban-react/freighter";
import { xbull } from "@soroban-react/xbull";

const chains = [
  {
    id: "testnet",
    name: "Stellar Testnet",
    network: "Test SDF Network ; September 2015",
    networkPassphrase: "Test SDF Network ; September 2015",
    networkUrl: "https://soroban-testnet.stellar.org:443",
    rpcUrl: "https://soroban-testnet.stellar.org:443"
  }
];

const connectors = [freighter(), xbull()];

export default function SorobanProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SorobanReactProvider chains={chains} connectors={connectors}>
      {children}
    </SorobanReactProvider>
  );
}

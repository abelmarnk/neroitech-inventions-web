"use client";
import { ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletSelectorProvider } from "./WalletSelectorContext";

// require('@solana/wallet-adapter-react-ui/styles.css');

interface WalletProvidersProps {
  children: ReactNode;
}

export const WalletProviders: React.FC<WalletProvidersProps> = ({
  children,
}) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = "https://api.devnet.solana.com";

  const wallets = useMemo(() => {
    const adapters = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ];
    const seen = new Set<string>();
    return adapters.filter((a) => {
      if (seen.has(a.name)) return false;
      seen.add(a.name);
      return true;
    });
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletSelectorProvider>{children}</WalletSelectorProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

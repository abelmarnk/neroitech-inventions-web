"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

type WalletSelectorContextType = {
  open: () => void;
  close: () => void;
};

const WalletSelectorContext = createContext<WalletSelectorContextType | null>(
  null
);

export const useWalletSelector = () => {
  const ctx = useContext(WalletSelectorContext);
  if (!ctx)
    throw new Error(
      "useWalletSelector must be used within WalletSelectorProvider"
    );
  return ctx;
};

export const WalletSelectorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <WalletSelectorContext.Provider value={{ open, close }}>
      {children}
      {visible && <WalletSelectorModal onClose={close} />}
    </WalletSelectorContext.Provider>
  );
};

const WalletSelectorModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { wallets, select } = useWallet();

  const listed = useMemo(() => {
    const byName = new Map<string, (typeof wallets)[number]>();
    const priority = (state: WalletReadyState) => {
      switch (state) {
        case WalletReadyState.Installed:
          return 0;
        case WalletReadyState.Loadable:
          return 1;
        case WalletReadyState.NotDetected:
          return 2;
        default:
          return 3; // Unsupported
      }
    };
    for (const w of wallets) {
      const name = (w.adapter?.name ?? "unknown").trim();
      if (!name) continue;
      if (w.readyState === WalletReadyState.Unsupported) continue;
      const existing = byName.get(name);
      if (!existing) {
        byName.set(name, w);
        continue;
      }
      // Keep the one with better readiness
      if (priority(w.readyState) < priority(existing.readyState)) {
        byName.set(name, w);
      }
    }
    return Array.from(byName.values()).sort((a, b) => {
      const pr = priority(a.readyState) - priority(b.readyState);
      if (pr !== 0) return pr;
      const an = (a.adapter?.name ?? "").toLowerCase();
      const bn = (b.adapter?.name ?? "").toLowerCase();
      return an.localeCompare(bn);
    });
  }, [wallets]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#111",
          color: "#fff",
          width: 360,
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18 }}>Select a Wallet</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: 0,
              color: "#aaa",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {listed.map((w, i) => {
            const name = w.adapter?.name ?? "Wallet";
            const icon = w.adapter?.icon as string | undefined; // data URL
            const readyLabel =
              w.readyState === WalletReadyState.Installed
                ? "Installed"
                : w.readyState === WalletReadyState.Loadable
                ? "Loadable"
                : w.readyState === WalletReadyState.NotDetected
                ? "Not detected"
                : "Unsupported";
            return (
              <button
                key={`${w.adapter?.name ?? "wallet"}-${i}`}
                onClick={() => {
                  if (w.adapter?.name) select(w.adapter.name);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#1b1b1b",
                  border: "1px solid #2a2a2a",
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                {/* icon or fallback */}
                {icon ? (
                  // Use a plain img tag so data URLs work without Next.js config
                  <img
                    src={icon}
                    alt={`${name} icon`}
                    width={28}
                    height={28}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    aria-hidden
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: "#2d2d2d",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      color: "#aaa",
                      fontWeight: 700,
                    }}
                  >
                    {name.slice(0, 1)}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                  <small
                    style={{
                      color: readyLabel === "Installed" ? "#7fdc7f" : "#bdbdbd",
                    }}
                  >
                    {readyLabel}
                  </small>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

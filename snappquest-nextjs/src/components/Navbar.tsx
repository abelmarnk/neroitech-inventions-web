"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletSelector } from "./wallet/WalletSelectorContext";
import { FiMenu } from "react-icons/fi";
import { usePathname } from "next/navigation";

interface NavbarProps {
  variant?: "home" | "profile";
}

export const Navbar: React.FC<NavbarProps> = ({ variant }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { publicKey, disconnect } = useWallet();
  const { open } = useWalletSelector();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const routeVariant = useMemo<"home" | "profile">(() => {
    const p = pathname || "/";
    return p.startsWith("/profile") ||
      p.startsWith("/balance") ||
      p.startsWith("/leaderboard")
      ? "profile"
      : "home";
  }, [pathname]);
  const effectiveVariant: "home" | "profile" = variant ?? routeVariant;
  const isHome = effectiveVariant === "home";

  // After connecting via the modal on the home page, redirect to profile
  useEffect(() => {
    if (publicKey && isHome) {
      window.location.href = "/profile";
    }
  }, [publicKey, isHome]);

  const Logout = async () => {
    if (publicKey) {
      // Call the disconnect function from the wallet adapter
      await disconnect();
      window.location.href = "/";
    }
  };

  const Login = async () => {
    if (publicKey) {
      window.location.href = "/profile";
      return;
    }
    // Open the custom wallet selector modal
    open();
  };

  return (
    <header className="flex justify-between">
      <div className="logo">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="SnappQuest Logo"
            width={140}
            height={40}
          />
        </Link>
      </div>
      <div className={`nav-container  ${mobileOpen ? "active" : ""}`}>
        <nav className="nav-links">
          {isHome ? (
            <>
              <Link href="#create-quest">Create Quest</Link>
              <Link
                href="https://t.me/SnappQuest/134"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Quest
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">Profile</Link>
              <Link href="/balance">View Balance</Link>
              <Link href="/leaderboard">View Leaderboard</Link>
            </>
          )}
        </nav>
        {mounted &&
          (publicKey ? (
            isHome ? (
              <Link href="/profile" className="connect-btn">
                Profile
              </Link>
            ) : (
              <button className="disconnect-btn" onClick={Logout}>
                Disconnect Wallet
              </button>
            )
          ) : (
            <button
              onClick={Login}
              className={isHome ? "connect-btn" : "disconnect-btn"}
            >
              Connect Wallet
            </button>
          ))}
      </div>
      {/* <div
        className={`hamburger ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen((o) => !o)}
      >
        <FiMenu />
      </div>
      <div
        className={`overlay ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
      /> */}
    </header>
  );
};

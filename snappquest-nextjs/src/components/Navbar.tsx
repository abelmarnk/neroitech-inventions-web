"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { FiMenu } from 'react-icons/fi';

const WalletMultiButtonDynamic: any = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(m => m.WalletMultiButton as any),
  { ssr: false }
);

interface NavbarProps { variant?: 'home' | 'profile'; }

export const Navbar: React.FC<NavbarProps> = ({ variant = 'home' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isHome = variant === 'home';

  return (
    <header>
      <div className="logo">
        <Link href="/"><Image src="/images/logo.png" alt="SnappQuest Logo" width={140} height={40} /></Link>
      </div>
      <div className={`nav-container ${mobileOpen ? 'active' : ''}`}>        
        <nav className="nav-links">
          {isHome ? (
            <>
              <a href="#create-quest">Create Quest</a>
              <a href="https://t.me/SnappQuest/134" target="_blank" rel="noopener noreferrer">Join Quest</a>
            </>
          ) : (
            <>
              <a href="#available-quests">Available Quests</a>
              <a href="#completed-quests">Completed Quests</a>
            </>
          )}
        </nav>
        {mounted && (
          publicKey ? (
            isHome ? (
              <Link href="/profile" className="connect-btn">Profile</Link>
            ) : (
              <button className="disconnect-btn" onClick={() => window.location.href = '/'}>Disconnect</button>
            )
          ) : (
            <Link href="/profile" className={isHome ? 'connect-btn' : 'disconnect-btn'}>
              {isHome ? 'Connect Wallet' : 'Disconnect'}
            </Link>
          )
        )}
      </div>
      <div className={`hamburger ${mobileOpen ? 'active':''}`} onClick={() => setMobileOpen(o => !o)}>
        <FiMenu />
      </div>
      <div className={`overlay ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(false)} />
    </header>
  );
};

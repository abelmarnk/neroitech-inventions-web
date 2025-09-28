import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./legacy.css";
// Styles for @solana/wallet-adapter-react-ui modal/buttons
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletProviders } from "@/components/wallet/WalletProviders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnappQuest",
  description: "Engage-to-Earn Quest Platform Prototype on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProviders>
          <Navbar />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </WalletProviders>
      </body>
    </html>
  );
}

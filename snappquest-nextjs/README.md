## SnappQuest (Next.js Migration)

Modernized prototype of the legacy static `snappquest` site rebuilt with:

- Next.js App Router + TypeScript
- Tailwind CSS v4 utilities
- Framer Motion (section / element animations)
- Solana Wallet Adapter (Phantom, Solflare, Torus, Ledger, Coinbase)
- Modular quest + task modeling in TypeScript

### Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Visit http://localhost:3000

### Structure

`src/components` – UI building blocks (hero, navbar, modals, etc.)
`src/components/modals` – Base + feature modals (learn more, create quest, copy confirmation)
`src/components/wallet` – Wallet provider composition
`src/types` – Domain models (`Quest`, `Task`)
`src/utils` – Currency formatting helpers
`src/app/page.tsx` – Landing page composition
`src/app/profile/page.tsx` – Quest progress & pagination demo

### Wallet Integration

Wrapped in `WalletProviders` (ConnectionProvider + WalletProvider + WalletModalProvider). Dynamic wallet multi-button is rendered inside `Navbar`.

### Quest Creation Flow

1. Open Create Quest modal (landing page)
2. Add tasks and reward
3. On create, quest stored locally in state and summary auto-copied to clipboard (confirmation modal appears)

### Possible Next Steps

- Persist quests to backend or localStorage
- Add server actions / API routes for multi-user state
- Integrate on-chain reward escrow logic
- Add authentication / gating for quest creation
- Add indexing / search for quests

---
Prototype focus: structure, animation, wallet enablement.

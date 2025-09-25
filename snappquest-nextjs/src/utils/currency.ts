export type Currency = "NGN" | "USDC";

interface CurrencyMeta {
  code: Currency;
  symbol: string;
  label: string;
  format: (value: number) => string;
}

export const CURRENCIES: Record<Currency, CurrencyMeta> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    label: "Naira (₦)",
    format: (v: number) => `₦${v.toLocaleString()}`,
  },
  USDC: {
    code: "USDC",
    symbol: "◉",
    label: "USDC",
    format: (v: number) => `${v.toFixed(2)} USDC`,
  },
};

export const formatAmount = (value: number, currency: Currency) =>
  CURRENCIES[currency].format(value);

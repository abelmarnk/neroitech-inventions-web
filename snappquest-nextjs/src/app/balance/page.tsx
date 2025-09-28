"use client";
import { useMemo, useState } from "react";

type Row = string[];

// Range can remain non-sensitive; server uses secure env for key and sheet id
const RANGE = "Form responses 3!A1:K1000";

const getEnv = (key: string, fallback = "") =>
  (typeof process !== "undefined" ? (process as any).env?.[key] : undefined) ||
  fallback;

const USERNAME_COL = getEnv("NEXT_PUBLIC_SHEETS_USERNAME_COLUMN", "Username");
const EARNINGS_COL = getEnv(
  "NEXT_PUBLIC_SHEETS_EARNINGS_COLUMN",
  "Total Earnings"
);
const BALANCE_COL = getEnv("NEXT_PUBLIC_SHEETS_BALANCE_COLUMN", "Balance");
const COMPLETED_COL = getEnv(
  "NEXT_PUBLIC_SHEETS_COMPLETED_COLUMN",
  "Completed Quests"
);

async function fetchSheet(): Promise<Row[]> {
  const url = `/api/sheets?range=${encodeURIComponent(RANGE)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
  const json = await res.json();
  return (json.values as Row[]) || [];
}

function findColumnIndex(headers: Row, name: string): number | null {
  const idx = headers.findIndex(
    (h) => h.trim().toLowerCase() === name.trim().toLowerCase()
  );
  return idx >= 0 ? idx : null;
}

function toNumber(val: string | undefined): number | null {
  if (!val) return null;
  const n = Number(String(val).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export default function BalancePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    balance: number | null;
    earnings: number | null;
    completed: number | null;
    row?: Row;
  } | null>(null);

  const disabled = useMemo(
    () => loading || !username.trim(),
    [loading, username]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const rows = await fetchSheet();
      if (!rows.length) throw new Error("No data returned from sheet");
      const [headers, ...data] = rows;
      const uIdx = findColumnIndex(headers, USERNAME_COL);
      const bIdx = findColumnIndex(headers, BALANCE_COL);
      const eIdx = findColumnIndex(headers, EARNINGS_COL);
      const cIdx = findColumnIndex(headers, COMPLETED_COL);

      // Fallback: if we can't locate USERNAME column, try to match in any cell
      let matched: Row | undefined;
      if (uIdx != null) {
        matched = data.find(
          (r) =>
            (r[uIdx!] || "").toLowerCase().trim() ===
            username.toLowerCase().trim()
        );
      }
      if (!matched) {
        const uname = username.toLowerCase().trim();
        matched = data.find((r) =>
          r.some((cell) =>
            String(cell || "")
              .toLowerCase()
              .includes(uname)
          )
        );
      }
      if (!matched) {
        setError("User not found. Please check the username and try again.");
        return;
      }
      const balance = bIdx != null ? toNumber(matched[bIdx!]) : null;
      const earnings = eIdx != null ? toNumber(matched[eIdx!]) : null;
      const completed = cIdx != null ? toNumber(matched[cIdx!]) : null;
      setResult({ balance, earnings, completed, row: matched });
    } catch (err: any) {
      setError(err?.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(52,211,153,0.1))",
            padding: 24,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Check Your Balance
          </h1>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontWeight: 500 }}>Username</span>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  padding: "12px 14px",
                  border: "1px solid #D1D5DB",
                  borderRadius: 8,
                  fontSize: 16,
                }}
              />
            </label>
            <button
              type="submit"
              disabled={disabled}
              style={{
                background: "linear-gradient(135deg, #6366F1, #34D399)",
                color: "#fff",
                border: 0,
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
              }}
            >
              {loading ? "Checking..." : "View Balance"}
            </button>
          </form>

          {error && (
            <p style={{ color: "#EF4444", marginTop: 12, textAlign: "center" }}>
              {error}
            </p>
          )}

          {result && (
            <div style={{ marginTop: 24 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Balance Details
              </h2>
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                <StatCard label="Balance" value={result.balance} prefix="$" />
                <StatCard
                  label="Total Earnings"
                  value={result.earnings}
                  prefix="$"
                />
                <StatCard label="Completed Quests" value={result.completed} />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  prefix = "",
}: {
  label: string;
  value: number | null;
  prefix?: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #eee",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color: "#34D399" }}>
        {value == null ? "—" : `${prefix}${value.toLocaleString()}`}
      </div>
      <div style={{ fontSize: 13, color: "#6B7280" }}>{label}</div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";

type Row = string[];

const RANGE = "Form responses 3!A1:K1000";

const getEnv = (key: string, fallback = "") =>
  (typeof process !== "undefined" ? (process as any).env?.[key] : undefined) ||
  fallback;

const USERNAME_COL = getEnv("NEXT_PUBLIC_SHEETS_USERNAME_COLUMN", "Username");
const NAME_COL = getEnv("NEXT_PUBLIC_SHEETS_NAME_COLUMN", "Name");
const EARNINGS_COL = getEnv(
  "NEXT_PUBLIC_SHEETS_EARNINGS_COLUMN",
  "Total Earnings"
);
const COMPLETED_COL = getEnv(
  "NEXT_PUBLIC_SHEETS_COMPLETED_COLUMN",
  "Total Quests Completed"
);
const CURRENCY_SYMBOL = getEnv("NEXT_PUBLIC_CURRENCY_SYMBOL", "₦");

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

function findFirstExistingIndex(headers: Row, names: string[]): number | null {
  for (const n of names) {
    const idx = findColumnIndex(headers, n);
    if (idx != null) return idx;
  }
  return null;
}

function includesAll(hay: string, subs: string[]) {
  const s = hay.toLowerCase();
  return subs.every((sub) => s.includes(sub.toLowerCase()));
}

function findByIncludes(
  headers: Row,
  mustInclude: string[],
  mustNotInclude: string[] = []
): number | null {
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] || "").toLowerCase();
    if (mustNotInclude.some((w) => h.includes(w.toLowerCase()))) continue;
    if (mustInclude.every((w) => h.includes(w.toLowerCase()))) return i;
  }
  return null;
}

function toNumber(val: string | undefined): number {
  const n = Number(String(val ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSheet();
        if (mounted) setRows(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to fetch leaderboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const table = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    const [headers, ...data] = rows;
    // Prefer provided NAME/USERNAME columns; then flexible includes; avoid timestamp
    let uIdx =
      findFirstExistingIndex(headers, [
        NAME_COL,
        USERNAME_COL,
        "Name",
        "Username",
      ]) ??
      findByIncludes(headers, ["name"]) ??
      findByIncludes(headers, ["user"]) ??
      null;
    if (uIdx == null) {
      // Avoid picking timestamp as a fallback
      if (
        headers.length > 1 &&
        String(headers[0]).toLowerCase().includes("time")
      )
        uIdx = 1;
      else uIdx = 0;
    }
    const eIdx = findColumnIndex(headers, EARNINGS_COL) ?? 0;
    const cIdx =
      findFirstExistingIndex(headers, [
        COMPLETED_COL,
        "Completed Quests",
        "Total Quests Completed",
      ]) ??
      findByIncludes(headers, ["quest", "complet"]) ??
      null;
    const sorted = [...data].sort(
      (a, b) => toNumber(b[eIdx]) - toNumber(a[eIdx])
    );
    return { headers, rows: sorted, uIdx, eIdx, cIdx } as const;
  }, [rows]);

  return (
    <main>
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          SnappQuest Leaderboard
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <a
            href="/profile"
            style={{
              background: "#6B7280",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Back to Profile
          </a>
        </div>
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {error && (
          <p style={{ color: "#EF4444", textAlign: "center" }}>{error}</p>
        )}

        {table && (
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(52,211,153,0.1))",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                      background: "linear-gradient(135deg, #6366F1, #34D399)",
                      color: "#fff",
                      borderTopLeftRadius: 12,
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                      background: "linear-gradient(135deg, #6366F1, #34D399)",
                      color: "#fff",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                      background: "linear-gradient(135deg, #6366F1, #34D399)",
                      color: "#fff",
                    }}
                  >
                    Total Earnings
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                      background: "linear-gradient(135deg, #6366F1, #34D399)",
                      color: "#fff",
                      borderTopRightRadius: 12,
                    }}
                  >
                    Total Quests Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr
                    key={i}
                    style={{
                      background:
                        i % 2
                          ? "rgba(243,244,246,0.8)"
                          : "rgba(255,255,255,0.8)",
                    }}
                  >
                    <td
                      style={{ padding: 14, fontWeight: 700, color: "#34D399" }}
                    >
                      {i + 1}
                    </td>
                    <td style={{ padding: 14 }}>
                      {r[table.uIdx] || "Unknown"}
                    </td>
                    <td style={{ padding: 14 }}>
                      {CURRENCY_SYMBOL}
                      {toNumber(r[table.eIdx]).toLocaleString()}
                    </td>
                    <td style={{ padding: 14 }}>
                      {table.cIdx != null ? toNumber(r[table.cIdx]) : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

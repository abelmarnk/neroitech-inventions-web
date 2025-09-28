import { NextRequest, NextResponse } from "next/server";

// Server-side only environment variables (do NOT prefix with NEXT_PUBLIC)
const API_KEY = process.env.SHEETS_API_KEY;
const SPREADSHEET_ID = process.env.SHEETS_SPREADSHEET_ID;
const RANGE = process.env.SHEETS_RANGE || "Form responses 3!A1:K1000";

export async function GET(req: NextRequest) {
  try {
    if (!API_KEY || !SPREADSHEET_ID) {
      return NextResponse.json(
        {
          error:
            "Server configuration missing SHEETS_API_KEY or SHEETS_SPREADSHEET_ID",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || RANGE;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
      range
    )}?key=${API_KEY}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json(
        { error: `Sheets API error: ${res.status} ${txt}` },
        { status: 500 }
      );
    }
    const json = await res.json();
    return NextResponse.json({ values: json.values ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

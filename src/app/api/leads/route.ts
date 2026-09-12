import { NextResponse } from "next/server";
import { saveLead } from "@/lib/save-lead";

export async function POST(request: Request) {
  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields." },
      { status: 400 },
    );
  }

  const result = await saveLead(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

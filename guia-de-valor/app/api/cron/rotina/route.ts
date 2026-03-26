import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Rotina cron em construção" }, { status: 200 });
}

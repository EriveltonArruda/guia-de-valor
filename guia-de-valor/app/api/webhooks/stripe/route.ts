import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Webhook do Stripe em construção" }, { status: 200 });
}

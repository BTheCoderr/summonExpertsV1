import { NextRequest, NextResponse } from "next/server";
import { getCurrentPlan } from "@/lib/db";

export async function GET() {
  const plan = getCurrentPlan("demo-user");
  return NextResponse.json({ plan: plan ?? null });
}

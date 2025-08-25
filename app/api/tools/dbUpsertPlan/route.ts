import { NextResponse } from "next/server";
import { dbUpsertPlan } from "@/lib/tools/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await dbUpsertPlan(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

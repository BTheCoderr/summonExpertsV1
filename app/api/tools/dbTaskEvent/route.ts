import { NextResponse } from "next/server";
import { dbTaskEvent } from "@/lib/tools/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await dbTaskEvent(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

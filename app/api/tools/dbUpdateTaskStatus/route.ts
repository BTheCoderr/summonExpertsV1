import { NextResponse } from "next/server";
import { dbUpdateTaskStatus } from "@/lib/tools/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await dbUpdateTaskStatus(body.task_id, body.status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

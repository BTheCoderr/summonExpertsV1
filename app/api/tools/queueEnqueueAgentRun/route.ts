import { NextResponse } from "next/server";
import { queueEnqueueAgentRun } from "@/lib/tools/queue";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await queueEnqueueAgentRun(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

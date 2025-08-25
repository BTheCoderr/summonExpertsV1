import { NextResponse } from "next/server";
import { slackPostMessage } from "@/lib/tools/integrations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await slackPostMessage(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

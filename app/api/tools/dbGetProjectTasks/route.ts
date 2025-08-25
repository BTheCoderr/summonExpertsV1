import { NextResponse } from "next/server";
import { dbGetProjectTasks } from "@/lib/tools/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await dbGetProjectTasks(body.project_id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

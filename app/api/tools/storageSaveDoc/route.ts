import { NextResponse } from "next/server";
import { storageSaveDoc } from "@/lib/tools/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await storageSaveDoc(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

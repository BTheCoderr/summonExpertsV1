import { NextRequest, NextResponse } from "next/server";
import { GrowthPlanDoc, PlanInputs, TPlanInputs } from "@/lib/schemas";
import { draftAndReviewOKR } from "@/lib/agents/okr";
import { savePlan } from "@/lib/db";

function uid() { return Math.random().toString(36).slice(2); }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = PlanInputs.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const inputs = parsed.data as TPlanInputs;
  const id = uid();
  const now = new Date().toISOString();
  const doc = {
    id,
    userId: "demo-user",
    inputs,
    status: "inputs_collected",
    version: 1,
    history: [{ ts: now, actor: "system", event: "created" }],
    title: `Strategic Plan for ${inputs.startDate} – ${inputs.endDate}`,
    createdAt: now,
    updatedAt: now,
  } as const;
  let plan = GrowthPlanDoc.parse(doc);
  
  // auto draft OKRs using multi-agent system
  try {
    const okr = await draftAndReviewOKR(inputs, "balanced");
    plan = { 
      ...plan, 
      okr, 
      status: "okr_draft", 
      updatedAt: new Date().toISOString(), 
      history: [...plan.history, { ts: new Date().toISOString(), actor: "multi-agent", event: "okr_draft" }] 
    };
  } catch (error) {
    console.error("Error drafting OKRs:", error);
    // Continue without OKRs - user can generate them later
  }
  
  savePlan(plan);
  return NextResponse.json({ plan });
}

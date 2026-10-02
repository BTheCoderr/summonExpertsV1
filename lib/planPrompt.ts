// lib/planPrompt.ts
export type PlanInputs = {
  businessName: string
  niche: string
  revenueGoal90d: number
  customerGoal90d: number
  avgOrderValue: number
  budgetMonthly: number
  strengths?: string[]
  constraints?: string[]
}

export function buildPlanPrompt(i: PlanInputs) {
  return [
    `You are a team of experts (Planner + Writer) generating a 90-day growth plan.`,
    ``,
    `Business: ${i.businessName}`,
    `Niche/ICP: ${i.niche}`,
    `Goals (90d): $${i.revenueGoal90d} revenue, ${i.customerGoal90d} customers`,
    `AOV: $${i.avgOrderValue}`,
    `Budget/month: $${i.budgetMonthly}`,
    `Strengths: ${i.strengths?.join(", ") || "n/a"}`,
    `Constraints: ${i.constraints?.join(", ") || "n/a"}`,
    ``,
    `Deliverable:`,
    `1) Goal (1–2 lines)`,
    `2) ICP (who/where)`,
    `3) Offers (primary + fast-start)`,
    `4) 90-Day Timeline by week (W1–W12)`,
    `5) 3 Core Plays with steps`,
    `6) KPIs & tracking cadence`,
    ``,
    `Keep it practical. No fluff. End with DONE.`
  ].join("\n")
}

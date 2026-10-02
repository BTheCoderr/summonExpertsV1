import { StrategyPlan, TStrategyPlan, TOKRBlock, TPlanInputs } from "../schemas";
import { callModel } from "../ai-enhanced";

export async function createStrategy(okr: TOKRBlock, selectedOpportunityIds: string[], inputs: TPlanInputs): Promise<TStrategyPlan> {
  const system = "You are a business strategist. Convert OKRs and selected opportunities into an actionable plan. Return valid JSON with this structure: {\"initiatives\": [{\"id\": \"init-1\", \"title\": \"string\", \"description\": \"string\", \"priority\": 1, \"mappedKRs\": [\"kr-1\"], \"dependsOn\": []}], \"lineOfAction\": [\"init-1\"], \"feasibilityNotes\": \"string\"}. Create 3-5 initiatives with clear priorities and dependencies.";
  
  const user = `Create a strategy based on:

OKRs:
- Objective: ${okr.objective}
- Key Results: ${okr.keyResults.map(kr => `${kr.id}: ${kr.description} (${kr.metric}: ${kr.target})`).join('\n  ')}

Selected Opportunities: ${selectedOpportunityIds.join(', ')}

Business Context:
- Availability: ${inputs.availabilityHrsPerWeek} hours/week
- Timeline: 90 days (${inputs.startDate} to ${inputs.endDate})
- Budget considerations: Current revenue $${inputs.business.currentRevenueMonthly || 0}/month

Create initiatives that:
1. Map directly to the key results
2. Are feasible within the time and resource constraints
3. Have clear priorities and dependencies
4. Lead to achieving the revenue goal of $${inputs.revenueGoal90d}

Return only valid JSON in the specified format.`;

  const out = await callModel({ 
    system, 
    user, 
    agentType: "strategy" 
  });
  
  let parsed: unknown;
  try { 
    parsed = JSON.parse(out); 
  } catch { 
    console.error("Failed to parse strategy response:", out);
    parsed = {};
  }
  
  const ok = StrategyPlan.safeParse(parsed);
  if (!ok.success) {
    console.error("Strategy validation failed:", ok.error);
    return {
      initiatives: [
        { id: "init-1", title: "Ship offer-led landing page", description: "Clear offer and form", priority: 1, mappedKRs: [okr.keyResults[1]?.id || "kr-2"], dependsOn: [] },
        { id: "init-2", title: "Referral booster program", description: "Incentivize referrals", priority: 2, mappedKRs: [okr.keyResults[0]?.id || "kr-1"], dependsOn: ["init-1"] },
        { id: "init-3", title: "Retargeting ads", description: "Pixel and warm audiences", priority: 3, mappedKRs: [okr.keyResults[1]?.id || "kr-2"], dependsOn: ["init-1"] },
      ],
      lineOfAction: ["init-1", "init-2", "init-3"],
      feasibilityNotes: "Fits in 90 days with part-time availability",
    };
  }
  return ok.data;
}

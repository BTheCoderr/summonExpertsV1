import { OKRBlock, PlanInputs, TOKRBlock, TPlanInputs } from "../schemas";
import { callModel } from "../ai-enhanced";

export async function draftAndReviewOKR(inputs: TPlanInputs, focus: "balanced" | "aggressive" | "low_risk" = "balanced"): Promise<TOKRBlock> {
  const system = "You are an OKR planner for small businesses. Create exactly one objective and 3–5 measurable key results. Return valid JSON with this structure: {\"objective\": \"string\", \"keyResults\": [{\"id\": \"kr-1\", \"description\": \"string\", \"metric\": \"string\", \"target\": \"string\"}], \"focus\": \"balanced\"}. Focus on practical, achievable goals that fit the business context and timeframe.";
  
  const user = `Create OKRs for this business:
- Revenue Goal (90 days): $${inputs.revenueGoal90d}
- Customer Goal (90 days): ${inputs.customerGoal90d} customers
- Availability: ${inputs.availabilityHrsPerWeek} hours/week
- Business: ${inputs.business.name} (${inputs.business.industry})
- Location: ${inputs.business.location.country}${inputs.business.location.state ? ', ' + inputs.business.location.state : ''}
- Current Revenue: $${inputs.business.currentRevenueMonthly || 0}/month
- Challenges: ${inputs.challenges?.join(', ') || 'None specified'}
- Focus: ${focus}

Return only valid JSON in the specified format.`;

  const draft = await callModel({ 
    system, 
    user, 
    agentType: "okr" 
  });
  
  let parsed: unknown;
  try { 
    parsed = JSON.parse(draft); 
  } catch { 
    console.error("Failed to parse OKR response:", draft);
    parsed = { 
      objective: "Grow revenue and customers", 
      keyResults: [], 
      focus 
    };
  }
  
  const ok = OKRBlock.safeParse(parsed);
  if (!ok.success) {
    console.error("OKR validation failed:", ok.error);
    // fallback minimal
    return {
      objective: "Grow revenue and customer base in 90 days",
      keyResults: [
        { id: "kr-1", description: "Acquire 60 new customers", metric: "New customers", target: "60" },
        { id: "kr-2", description: "Reach 30k in new revenue", metric: "Revenue", target: "30000" },
        { id: "kr-3", description: "Increase lead to close to 25%", metric: "Close rate", target: "25%" },
      ],
      focus,
    };
  }
  return ok.data;
}

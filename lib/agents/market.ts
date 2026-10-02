import { MarketAnalysis, TMarketAnalysis, TPlanInputs } from "../schemas";
import { callModel } from "../ai-enhanced";

export async function runMarketAnalysis(inputs: TPlanInputs): Promise<TMarketAnalysis> {
  const system = "You are a market analyst. Analyze market opportunities and provide insights. Return valid JSON with this structure: {\"industryTrends\": [\"string\"], \"bestPractices\": [\"string\"], \"seasonal\": [\"string\"], \"competitorActivity\": [\"string\"], \"growthOpportunities\": [{\"id\": \"opp-1\", \"label\": \"string\", \"rationale\": \"string\"}]}. Provide at least 3 growth opportunities with unique IDs.";
  
  const user = `Analyze market opportunities for this business:
- Business: ${inputs.business.name} 
- Industry: ${inputs.business.industry}
- Location: ${inputs.business.location.country}${inputs.business.location.state ? ', ' + inputs.business.location.state : ''}
- Current Revenue: $${inputs.business.currentRevenueMonthly || 0}/month
- Revenue Goal: $${inputs.revenueGoal90d} in 90 days
- Customer Goal: ${inputs.customerGoal90d} customers in 90 days
- Channels: ${inputs.business.channels?.join(', ') || 'Not specified'}
- Description: ${inputs.business.description || 'Not provided'}

Focus on actionable insights and specific opportunities for this industry and location.
Return only valid JSON in the specified format.`;

  const out = await callModel({ 
    system, 
    user, 
    agentType: "market" 
  });
  
  let parsed: unknown;
  try { 
    parsed = JSON.parse(out); 
  } catch { 
    console.error("Failed to parse market analysis response:", out);
    parsed = {};
  }
  
  const ok = MarketAnalysis.safeParse(parsed);
  if (!ok.success) {
    console.error("Market analysis validation failed:", ok.error);
    return {
      industryTrends: ["Digital demand shifts", "AI-assisted operations"],
      bestPractices: ["Tight ICP", "Offer-led landing pages", "Fast follow-up"],
      seasonal: ["Q4 holiday demand spikes"],
      competitorActivity: ["Local ad spend rising", "New referral promos"],
      growthOpportunities: [
        { id: "opp-a", label: "Referral booster program", rationale: "High trust channel in local markets" },
        { id: "opp-b", label: "Offer-led landing page", rationale: "Improves CVR within 2 weeks" },
        { id: "opp-c", label: "Retargeting warm leads", rationale: "Low CAC with pixel audiences" },
      ],
    };
  }
  return ok.data;
}

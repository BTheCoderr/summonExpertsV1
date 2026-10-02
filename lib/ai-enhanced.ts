// Unified AI caller with provider switch. 
// Enhanced to use multi-agent system for strategic planning

export type Model = "claude-3-5-sonnet" | "gpt-4o" | "multi-agent" | "mock";

export async function callModel(args: {
  model?: Model;
  system: string;
  user: string;
  temperature?: number;
  agentType?: "okr" | "market" | "strategy" | "roadmap";
}): Promise<string> {
  const provider = (process.env.AI_PROVIDER || "multi-agent") as Model;
  const model = args.model || provider;
  
  if (model === "multi-agent") {
    // Use your existing multi-agent system
    return await callMultiAgentSystem(args.system, args.user, args.agentType);
  }
  
  if (model === "mock") {
    // simple deterministic mock for development
    return mockRespond(args.system, args.user);
  }
  
  // fallback to mock for unknown models
  return mockRespond(args.system, args.user);
}

async function callMultiAgentSystem(system: string, user: string, agentType?: string): Promise<string> {
  try {
    const agentHost = process.env.AGENT_HOST || "http://localhost:5057";
    
    // Create a structured prompt for your multi-agent system
    const prompt = `${system}\n\nUser Request: ${user}`;
    
    // Call your existing multi-agent API
    const response = await fetch(`${agentHost}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: prompt,
      }),
    });
    
    if (!response.ok) {
      console.error("Multi-agent system error:", response.status, response.statusText);
      return mockRespond(system, user);
    }
    
    const result = await response.json();
    return result.response || "No response from multi-agent system";
    
  } catch (error) {
    console.error("Error calling multi-agent system:", error);
    // Fallback to mock if multi-agent system is unavailable
    return mockRespond(system, user);
  }
}

function mockRespond(system: string, user: string): string {
  // Simple heuristic to return JSON-like strings for our agents
  if (system.includes("OKR planner")) {
    const id = (n: number) => `kr-${n}`;
    return JSON.stringify({
      objective: "Grow revenue and customer base in 90 days",
      keyResults: [
        { id: id(1), description: "Acquire 60 new customers", metric: "New customers", target: "60" },
        { id: id(2), description: "Reach 30k in new revenue", metric: "Revenue", target: "30000" },
        { id: id(3), description: "Increase lead to close to 25%", metric: "Close rate", target: "25%" },
      ],
      focus: "balanced",
    });
  }
  if (system.includes("Market analyst")) {
    return JSON.stringify({
      industryTrends: ["Digital demand shifts", "AI-assisted operations"],
      bestPractices: ["Tight ICP", "Offer-led landing pages", "Fast follow-up"],
      seasonal: ["Q4 holiday demand spikes"],
      competitorActivity: ["Local ad spend rising", "New referral promos"],
      growthOpportunities: [
        { id: "opp-a", label: "Referral booster program", rationale: "High trust channel in local markets" },
        { id: "opp-b", label: "Offer-led landing page", rationale: "Improves CVR within 2 weeks" },
        { id: "opp-c", label: "Retargeting warm leads", rationale: "Low CAC with pixel audiences" },
      ],
    });
  }
  if (system.includes("business strategist")) {
    return JSON.stringify({
      initiatives: [
        { id: "init-1", title: "Ship offer-led landing page", description: "Clear offer and form", priority: 1, mappedKRs: ["kr-2", "kr-3"], dependsOn: [] },
        { id: "init-2", title: "Referral booster program", description: "Incentivize referrals", priority: 2, mappedKRs: ["kr-1"], dependsOn: ["init-1"] },
        { id: "init-3", title: "Retargeting ads", description: "Pixel and warm audiences", priority: 3, mappedKRs: ["kr-2"], dependsOn: ["init-1"] },
      ],
      lineOfAction: ["init-1", "init-2", "init-3"],
      feasibilityNotes: "Fits in 90 days with part-time availability",
    });
  }
  if (system.includes("project scheduler")) {
    const start = new Date();
    const end1 = new Date(start.getTime() + 14 * 24 * 3600 * 1000);
    const end2 = new Date(start.getTime() + 42 * 24 * 3600 * 1000);
    const end3 = new Date(start.getTime() + 84 * 24 * 3600 * 1000);
    return JSON.stringify([
      { initiativeId: "init-1", initiative: "Ship offer-led landing page", start: start.toISOString(), end: end1.toISOString(), dependencies: [], metric: "Revenue" },
      { initiativeId: "init-2", initiative: "Referral booster program", start: end1.toISOString(), end: end2.toISOString(), dependencies: ["init-1"], metric: "New customers" },
      { initiativeId: "init-3", initiative: "Retargeting ads", start: end2.toISOString(), end: end3.toISOString(), dependencies: ["init-1"], metric: "Revenue" },
    ]);
  }
  return "{}";
}

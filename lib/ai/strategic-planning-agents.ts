import { 
  PlanInputsType, 
  OKRBlockType, 
  MarketAnalysisType, 
  StrategyPlanType, 
  RoadmapRowType,
  FocusTypeType 
} from "@/lib/schemas/strategic-planning";

// AI Model configuration - using your FREE local models
export type Model = "llama3.2:3b" | "qwen2.5:0.5b" | "gemma2:2b" | "mistral:latest" | "phi3:mini";

// Base AI call utility that integrates with your AutoGen service
export async function callModel<T>(args: {
  model: Model;
  system: string;
  user: string;
  temperature?: number;
}): Promise<T> {
  const response = await fetch(`${process.env.AGENT_HOST || 'http://localhost:5057'}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_type: 'business_planning',
      message: `${args.system}\n\nUser Request:\n${args.user}`,
      model: args.model,
      temperature: args.temperature || 0.7
    }),
  });

  if (!response.ok) {
    throw new Error(`AI service error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response as T;
}

// OKR Planner Agent
export async function draftOKRs(
  inputs: PlanInputsType, 
  focus: FocusTypeType = "balanced"
): Promise<OKRBlockType> {
  const system = `You are an OKR planner for small businesses. Produce exactly one objective and 3–5 key results with clear, measurable metrics. Map targets to the user's 90-day revenue and customer goals. Avoid listing initiatives.

Return JSON strictly matching this schema:
{
  "objective": "string",
  "keyResults": [
    {
      "id": "kr-1",
      "description": "string",
      "target": "string (e.g., 'Add 60 net-new customers')",
      "metric": "string (e.g., 'New customers')",
      "baseline": "number (optional)",
      "goal": "number (optional)",
      "owner": "string (optional)"
    }
  ],
  "focus": "${focus}"
}`;

  const user = `Inputs: ${JSON.stringify(inputs, null, 2)}
Business highlights: ${JSON.stringify(inputs.business, null, 2)}
Focus: ${focus}`;

  return callModel<OKRBlockType>({
    model: "llama3.2:3b",
    system,
    user,
    temperature: 0.7
  });
}

// OKR Coach Agent (Reviewer)
export async function reviewOKRs(
  draftOKR: OKRBlockType, 
  inputs: PlanInputsType
): Promise<OKRBlockType> {
  const system = `You are an OKR reviewer. Enforce one objective and 3–5 KRs. Remove vagueness, add missing metrics, adjust unrealistic targets based on availability and goals. Keep formatting within the JSON schema.

Return a corrected OKRBlock JSON. Include focus.`;

  const user = `Draft OKR: ${JSON.stringify(draftOKR, null, 2)}
Inputs: ${JSON.stringify(inputs, null, 2)}`;

  return callModel<OKRBlockType>({
    model: "qwen2.5:0.5b",
    system,
    user,
    temperature: 0.5
  });
}

// Market Analyst Agent
export async function analyzeMarket(inputs: PlanInputsType): Promise<MarketAnalysisType> {
  const system = `You are a market analyst. Using the business industry and location, return five sections:
industryTrends, bestPractices, seasonal, competitorActivity, growthOpportunities.
Each list must be concise, evidence-based, and localized where possible. Provide 3–5 growthOpportunities with id, label, rationale. Do not include citations.

Return JSON matching this schema:
{
  "industryTrends": ["string"],
  "bestPractices": ["string"],
  "seasonal": ["string"],
  "competitorActivity": ["string"],
  "growthOpportunities": [
    {
      "id": "opp-1",
      "label": "string",
      "rationale": "string"
    }
  ]
}`;

  const user = `Inputs: ${JSON.stringify(inputs, null, 2)}`;

  return callModel<MarketAnalysisType>({
    model: "gemma2:2b",
    system,
    user,
    temperature: 0.6
  });
}

// Strategy Agent
export async function createStrategy(
  okr: OKRBlockType, 
  selectedOpportunities: string[], 
  inputs: PlanInputsType
): Promise<StrategyPlanType> {
  const system = `You are a business strategist. Convert OKRs and selected opportunities into an actionable plan. Create initiatives with priority and dependencies. Include a lineOfAction sequence. Tie each initiative to KR ids. Ensure feasibility given availability and a 90-day timeline.

Return JSON matching this schema:
{
  "initiatives": [
    {
      "id": "init-1",
      "title": "string",
      "description": "string",
      "priority": 1,
      "dependsOn": [],
      "mappedKRs": ["kr-1"],
      "effortHrs": 20,
      "riskNotes": "string (optional)"
    }
  ],
  "lineOfAction": ["init-1", "init-2"],
  "feasibilityNotes": "string (optional)"
}`;

  const user = `OKR: ${JSON.stringify(okr, null, 2)}
Selected opportunities: ${JSON.stringify(selectedOpportunities, null, 2)}
Inputs: ${JSON.stringify(inputs, null, 2)}`;

  return callModel<StrategyPlanType>({
    model: "mistral:latest",
    system,
    user,
    temperature: 0.7
  });
}

// Business Coach Agent (Strategy Reviewer)
export async function reviewStrategy(
  strategy: StrategyPlanType, 
  okr: OKRBlockType, 
  inputs: PlanInputsType
): Promise<StrategyPlanType> {
  const system = `You review the strategy. Check market alignment, feasibility, realistic timelines, and that the plan can exceed goals. If issues, modify initiatives and lineOfAction. Keep JSON schema intact.

Return corrected StrategyPlan JSON with brief feasibilityNotes.`;

  const user = `Draft strategy: ${JSON.stringify(strategy, null, 2)}
OKR: ${JSON.stringify(okr, null, 2)}
Inputs: ${JSON.stringify(inputs, null, 2)}`;

  return callModel<StrategyPlanType>({
    model: "phi3:mini",
    system,
    user,
    temperature: 0.5
  });
}

// Project Manager Agent
export async function buildRoadmap(
  strategy: StrategyPlanType, 
  okr: OKRBlockType, 
  inputs: PlanInputsType
): Promise<RoadmapRowType[]> {
  const system = `You are a project scheduler. Convert initiatives and lineOfAction into a 90-day roadmap. Each row includes initiative, ISO start and end dates, dependencies, and a metric from mapped KRs. Respect availability hours per week.

Return array of RoadmapRow JSON:
[
  {
    "initiativeId": "init-1",
    "initiative": "string",
    "start": "2025-01-01",
    "end": "2025-01-31",
    "dependencies": [],
    "metric": "string (from a KR)"
  }
]`;

  const user = `Strategy: ${JSON.stringify(strategy, null, 2)}
OKR: ${JSON.stringify(okr, null, 2)}
Inputs: ${JSON.stringify(inputs, null, 2)}`;

  return callModel<RoadmapRowType[]>({
    model: "llama3.2:3b",
    system,
    user,
    temperature: 0.6
  });
}

// Research tool hook for Phase 3 (optional web research)
export interface ResearchResult {
  trends: string[];
  competitors: string[];
  seasonal: string[];
  sources?: string[];
}

export async function researchIndustry(args: {
  industry: string;
  country: string;
  state?: string;
  county?: string;
}): Promise<ResearchResult> {
  // This can be implemented with your web search tool later
  // For now, return a placeholder that agents can use
  return {
    trends: [`${args.industry} industry is growing in ${args.country}`],
    competitors: [`Key competitors in ${args.industry} market`],
    seasonal: [`Seasonal patterns in ${args.industry}`],
    sources: []
  };
}

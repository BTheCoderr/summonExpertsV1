import { z } from "zod";

export const PlanStatus = z.enum([
  "inputs_collected",
  "okr_draft",
  "okr_approved",
  "market_ready",
  "strategy_draft",
  "strategy_approved",
  "roadmap_draft",
  "roadmap_approved",
  "complete",
]);

export const BusinessHighlights = z.object({
  name: z.string(),
  industry: z.string(),
  description: z.string().optional(),
  location: z.object({
    country: z.string(),
    state: z.string().optional(),
    county: z.string().optional(),
    city: z.string().optional(),
  }),
  avgDealSize: z.number().optional(),
  currentRevenueMonthly: z.number().optional(),
  channels: z.array(z.string()).optional(),
});

export const PlanInputs = z.object({
  revenueGoal90d: z.number(),
  customerGoal90d: z.number(),
  challenges: z.array(z.string()).optional().default([]),
  availabilityHrsPerWeek: z.number(),
  business: BusinessHighlights,
  startDate: z.string(), // ISO
  endDate: z.string(),   // ISO
});

export const KeyResult = z.object({
  id: z.string(),
  description: z.string(),
  target: z.string(),      // e.g., "Add 60 net-new customers"
  metric: z.string(),      // e.g., "New customers"
  baseline: z.number().optional(),
  goal: z.number().optional(),
  owner: z.string().optional(),
});

export const OKRBlock = z.object({
  objective: z.string(),
  keyResults: z.array(KeyResult).min(3).max(5),
  focus: z.enum(["balanced", "aggressive", "low_risk"]).default("balanced"),
});

export const MarketAnalysis = z.object({
  industryTrends: z.array(z.string()),
  bestPractices: z.array(z.string()),
  seasonal: z.array(z.string()),
  competitorActivity: z.array(z.string()),
  growthOpportunities: z.array(z.object({
    id: z.string(),
    label: z.string(),
    rationale: z.string(),
  })).min(3),
  selectedOpportunityIds: z.array(z.string()).optional(),
});

export const Initiative = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number(), // 1..N
  dependsOn: z.array(z.string()).default([]), // initiative ids
  mappedKRs: z.array(z.string()).default([]), // KR ids
  effortHrs: z.number().optional(),
  riskNotes: z.string().optional(),
});

export const StrategyPlan = z.object({
  initiatives: z.array(Initiative).min(3),
  lineOfAction: z.array(z.string()), // initiative ids in sequence
  feasibilityNotes: z.string().optional(),
});

export const RoadmapRow = z.object({
  initiativeId: z.string(),
  initiative: z.string(),
  start: z.string(), // ISO date
  end: z.string(),   // ISO date
  dependencies: z.array(z.string()).default([]),
  metric: z.string(), // from a KR
});

export const GrowthPlanDoc = z.object({
  id: z.string(),
  userId: z.string(),
  inputs: PlanInputs,
  okr: OKRBlock.optional(),
  market: MarketAnalysis.optional(),
  strategy: StrategyPlan.optional(),
  roadmap: z.array(RoadmapRow).optional(),
  status: PlanStatus,
  version: z.number().default(1),
  history: z.array(z.object({
    ts: z.string(),
    actor: z.string(), // system, reviewer, user
    event: z.string(),
    payload: z.any().optional(),
  })),
  title: z.string(), // "Strategic Plan for {start} – {end}"
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type exports
export type PlanStatusType = z.infer<typeof PlanStatus>;
export type BusinessHighlightsType = z.infer<typeof BusinessHighlights>;
export type PlanInputsType = z.infer<typeof PlanInputs>;
export type KeyResultType = z.infer<typeof KeyResult>;
export type OKRBlockType = z.infer<typeof OKRBlock>;
export type MarketAnalysisType = z.infer<typeof MarketAnalysis>;
export type InitiativeType = z.infer<typeof Initiative>;
export type StrategyPlanType = z.infer<typeof StrategyPlan>;
export type RoadmapRowType = z.infer<typeof RoadmapRow>;
export type GrowthPlanDocType = z.infer<typeof GrowthPlanDoc>;

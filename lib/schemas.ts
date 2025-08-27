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
  revenueGoal90d: z.number().nonnegative(),
  customerGoal90d: z.number().nonnegative(),
  challenges: z.array(z.string()).optional().default([]),
  availabilityHrsPerWeek: z.number().nonnegative(),
  business: BusinessHighlights,
  startDate: z.string(),
  endDate: z.string(),
});

export const KeyResult = z.object({
  id: z.string(),
  description: z.string(),
  target: z.string(),
  metric: z.string(),
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
  growthOpportunities: z.array(
    z.object({ id: z.string(), label: z.string(), rationale: z.string() })
  ).min(3),
  selectedOpportunityIds: z.array(z.string()).optional(),
});

export const Initiative = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number(),
  dependsOn: z.array(z.string()).default([]),
  mappedKRs: z.array(z.string()).default([]),
  effortHrs: z.number().optional(),
  riskNotes: z.string().optional(),
});

export const StrategyPlan = z.object({
  initiatives: z.array(Initiative).min(3),
  lineOfAction: z.array(z.string()),
  feasibilityNotes: z.string().optional(),
});

export const RoadmapRow = z.object({
  initiativeId: z.string(),
  initiative: z.string(),
  start: z.string(),
  end: z.string(),
  dependencies: z.array(z.string()).default([]),
  metric: z.string(),
});

export const HistoryItem = z.object({
  ts: z.string(),
  actor: z.string(),
  event: z.string(),
  payload: z.any().optional(),
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
  history: z.array(HistoryItem),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TPlanInputs = z.infer<typeof PlanInputs>;
export type TOKRBlock = z.infer<typeof OKRBlock>;
export type TMarketAnalysis = z.infer<typeof MarketAnalysis>;
export type TStrategyPlan = z.infer<typeof StrategyPlan>;
export type TRoadmapRow = z.infer<typeof RoadmapRow>;
export type TGrowthPlanDoc = z.infer<typeof GrowthPlanDoc>;

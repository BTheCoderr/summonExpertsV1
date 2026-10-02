import { z } from "zod";

// Core enums and status types
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

export const FocusType = z.enum(["balanced", "aggressive", "low_risk"]);

// Business and location schemas
export const BusinessLocation = z.object({
  country: z.string(),
  state: z.string().optional(),
  county: z.string().optional(),
  city: z.string().optional(),
});

export const BusinessHighlights = z.object({
  name: z.string(),
  industry: z.string(),
  description: z.string().optional(),
  location: BusinessLocation,
  avgDealSize: z.number().optional(),
  currentRevenueMonthly: z.number().optional(),
  channels: z.array(z.string()).optional(),
});

// Plan inputs and core data
export const PlanInputs = z.object({
  revenueGoal90d: z.number(),
  customerGoal90d: z.number(),
  challenges: z.array(z.string()).optional().default([]),
  availabilityHrsPerWeek: z.number(),
  business: BusinessHighlights,
  startDate: z.string(), // ISO date
  endDate: z.string(),   // ISO date
});

// OKR system
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
  focus: FocusType.default("balanced"),
});

// Market analysis
export const GrowthOpportunity = z.object({
  id: z.string(),
  label: z.string(),
  rationale: z.string(),
});

export const MarketAnalysis = z.object({
  industryTrends: z.array(z.string()),
  bestPractices: z.array(z.string()),
  seasonal: z.array(z.string()),
  competitorActivity: z.array(z.string()),
  growthOpportunities: z.array(GrowthOpportunity).min(3),
  selectedOpportunityIds: z.array(z.string()).optional(),
});

// Strategy and initiatives
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

// Roadmap and execution
export const RoadmapRow = z.object({
  initiativeId: z.string(),
  initiative: z.string(),
  start: z.string(), // ISO date
  end: z.string(),   // ISO date
  dependencies: z.array(z.string()).default([]),
  metric: z.string(), // from a KR
});

// History and audit trail
export const HistoryEntry = z.object({
  ts: z.string(),
  actor: z.string(), // system, reviewer, user
  event: z.string(),
  payload: z.any().optional(),
});

// Main document schema
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
  history: z.array(HistoryEntry),
  title: z.string(), // "Strategic Plan for {start} – {end}"
  createdAt: z.string(),
  updatedAt: z.string(),
});

// API request/response types
export const CreatePlanRequest = PlanInputs.extend({
  autoDraftOkrs: z.boolean().default(true),
});

export const ApproveOKRRequest = z.object({
  approved: z.boolean(),
  regenerateFocus: FocusType.optional(),
});

export const MarketSelectionRequest = z.object({
  selectedOpportunityIds: z.array(z.string()),
});

export const StrategyApprovalRequest = z.object({
  approved: z.boolean(),
  changeRequest: z.string().optional(),
});

export const RoadmapApprovalRequest = z.object({
  approved: z.boolean(),
});

// Type exports
export type PlanStatusType = z.infer<typeof PlanStatus>;
export type FocusTypeType = z.infer<typeof FocusType>;
export type BusinessLocationType = z.infer<typeof BusinessLocation>;
export type BusinessHighlightsType = z.infer<typeof BusinessHighlights>;
export type PlanInputsType = z.infer<typeof PlanInputs>;
export type KeyResultType = z.infer<typeof KeyResult>;
export type OKRBlockType = z.infer<typeof OKRBlock>;
export type GrowthOpportunityType = z.infer<typeof GrowthOpportunity>;
export type MarketAnalysisType = z.infer<typeof MarketAnalysis>;
export type InitiativeType = z.infer<typeof Initiative>;
export type StrategyPlanType = z.infer<typeof StrategyPlan>;
export type RoadmapRowType = z.infer<typeof RoadmapRow>;
export type HistoryEntryType = z.infer<typeof HistoryEntry>;
export type GrowthPlanDocType = z.infer<typeof GrowthPlanDoc>;
export type CreatePlanRequestType = z.infer<typeof CreatePlanRequest>;
export type ApproveOKRRequestType = z.infer<typeof ApproveOKRRequest>;
export type MarketSelectionRequestType = z.infer<typeof MarketSelectionRequest>;
export type StrategyApprovalRequestType = z.infer<typeof StrategyApprovalRequest>;
export type RoadmapApprovalRequestType = z.infer<typeof RoadmapApprovalRequest>;

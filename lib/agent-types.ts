// AI Agent Architecture Types for Summon Experts

export interface AgentRequest {
  command: string;
  context?: {
    pageId?: string;
    databaseId?: string;
    userId?: string;
    sessionId?: string;
  };
  parameters?: Record<string, any>;
  intent?: 'summarize' | 'create_task' | 'search' | 'analyze' | 'plan' | 'execute';
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    agent: string;
    executionTime: number;
    tokensUsed?: number;
    confidence?: number;
  };
}

export interface NotionPage {
  id: string;
  title: string;
  content: string;
  properties?: Record<string, any>;
  lastEdited?: string;
}

export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
  entries: NotionPage[];
}

export interface PlanningStep {
  agent: string;
  action: string;
  parameters: Record<string, any>;
  dependencies?: string[];
  estimatedTime?: number;
}

export interface ExecutionPlan {
  steps: PlanningStep[];
  estimatedTotalTime: number;
  fallbackPlan?: PlanningStep[];
}

export interface MemoryContext {
  sessionId: string;
  userId: string;
  shortTerm: {
    currentTask?: string;
    recentCommands: string[];
    contextData: Record<string, any>;
  };
  longTerm: {
    userPreferences: Record<string, any>;
    frequentlyUsedCommands: string[];
    performanceMetrics: Record<string, any>;
  };
}

export interface AgentCapabilities {
  agent: string;
  capabilities: string[];
  maxTokens?: number;
  rateLimit?: number;
  costPerToken?: number;
}

export type AgentType = 'orchestrator' | 'notion' | 'planning' | 'claude' | 'gpt' | 'execution';

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapabilities;
  enabled: boolean;
  priority: number;
}

// Business Planning Specific Types
export interface BusinessPlan {
  id: string;
  title: string;
  executiveSummary: string;
  marketAnalysis: MarketAnalysis;
  financialProjections: FinancialProjections;
  strategicPillars: StrategicPillar[];
  timeline: Timeline;
  risks: Risk[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketAnalysis {
  targetMarket: string;
  competitors: Competitor[];
  marketSize: string;
  trends: string[];
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare?: string;
}

export interface FinancialProjections {
  year1: FinancialYear;
  year3: FinancialYear;
  year5: FinancialYear;
  assumptions: string[];
}

export interface FinancialYear {
  revenue: string;
  margin: string;
  expenses: string[];
}

export interface StrategicPillar {
  name: string;
  description: string;
  objectives: string[];
  metrics: string[];
}

export interface Timeline {
  phases: Phase[];
  milestones: Milestone[];
}

export interface Phase {
  name: string;
  duration: string;
  objectives: string[];
  deliverables: string[];
}

export interface Milestone {
  name: string;
  date: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Risk {
  category: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

// Task Management Types
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
  subtasks: Subtask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

// Analytics and Metrics
export interface AgentMetrics {
  agentId: string;
  requestsProcessed: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  costPerRequest: number;
  lastUpdated: string;
  executionTime?: number;
  success?: boolean;
}

export interface UserAnalytics {
  userId: string;
  totalSessions: number;
  commandsUsed: Record<string, number>;
  averageSessionDuration: number;
  mostUsedFeatures: string[];
  satisfactionScore?: number;
} 
/**
 * Strategic Planning Agents
 * Specialized agents for the strategic planning workflow
 * These integrate with your multi-agent orchestrator
 */

import { Agent, AgentResponse } from './multi-agent-orchestrator'
import { callModel, researchIndustry } from '../ai'
import { 
  OKRBlock, 
  MarketAnalysis, 
  StrategyPlan, 
  RoadmapRow,
  PlanInputs,
  OKRBlockType,
  MarketAnalysisType,
  StrategyPlanType,
  RoadmapRowType,
  PlanInputsType
} from '../schemas/strategic-plan'

// Base class for strategic planning agents
abstract class StrategicPlanningAgent implements Agent {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public capabilities: string[]
  ) {}
  
  abstract process(message: string, context?: any): Promise<AgentResponse>
  
  protected createResponse(content: string, metadata?: Record<string, any>): AgentResponse {
    return {
      content,
      metadata,
      shouldTerminate: false
    }
  }
  
  protected createTerminalResponse(content: string, metadata?: Record<string, any>): AgentResponse {
    return {
      content,
      metadata,
      shouldTerminate: true
    }
  }
  
  protected logActivity(event: string, payload?: any) {
    console.log(`[${this.name}] ${event}`, payload)
  }
}

// OKR Planner Agent
export class OKRPlannerAgent extends StrategicPlanningAgent {
  constructor() {
    super(
      'okr-planner',
      'OKR Planner',
      'Creates objectives and key results for business growth plans',
      ['okr_creation', 'goal_mapping', 'metric_definition']
    )
  }
  
  async process(message: string, context?: any): Promise<AgentResponse> {
    this.logActivity('Processing OKR planning request', { message: message.substring(0, 100) })
    
    try {
      // Extract plan inputs from context or message
      const planInputs = this.extractPlanInputs(context, message)
      
      // Call AI model to generate OKRs
      const response = await callModel<OKRBlockType>({
        model: 'claude-3-5-sonnet',
        system: `You are an OKR planner for small businesses. Produce exactly one objective and 3–5 key results with clear, measurable metrics. Map targets to the user's 90-day revenue and customer goals. Avoid listing initiatives.

Return JSON strictly matching this schema:
{
  "objective": "string",
  "keyResults": [
    {
      "id": "kr-1",
      "description": "string",
      "target": "string",
      "metric": "string",
      "baseline": "number",
      "goal": "number"
    }
  ],
  "focus": "balanced"
}`,
        user: `Inputs: ${JSON.stringify(planInputs, null, 2)}`
      })
      
      const okr = response.data
      
      this.logActivity('OKR generated successfully', { okr })
      
      return this.createTerminalResponse(
        `✅ **OKR Plan Created Successfully!**

**Objective:** ${okr.objective}

**Key Results:**
${okr.keyResults.map(kr => `• ${kr.description}: ${kr.target}`).join('\n')}

**Focus:** ${okr.focus}

Your OKR plan is ready for review and approval.`,
        { 
          okr,
          type: 'okr_plan',
          status: 'completed'
        }
      )
      
    } catch (error) {
      this.logActivity('Error generating OKRs', { error: error.message })
      return this.createResponse(`❌ Error creating OKR plan: ${error.message}`)
    }
  }
  
  private extractPlanInputs(context: any, message: string): PlanInputsType {
    // Try to get from context first
    if (context?.planInputs) {
      return context.planInputs
    }
    
    // Fallback: try to parse from message
    try {
      const jsonMatch = message.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    // Default fallback
    return {
      revenueGoal90d: 30000,
      customerGoal90d: 60,
      challenges: [],
      availabilityHrsPerWeek: 20,
      business: {
        name: "Sample Business",
        industry: "Technology",
        location: { country: "US" }
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }
}

// Market Analyst Agent
export class MarketAnalystAgent extends StrategicPlanningAgent {
  constructor() {
    super(
      'market-analyst',
      'Market Analyst',
      'Analyzes market trends, competitors, and growth opportunities',
      ['market_research', 'trend_analysis', 'opportunity_identification']
    )
  }
  
  async process(message: string, context?: any): Promise<AgentResponse> {
    this.logActivity('Processing market analysis request', { message: message.substring(0, 100) })
    
    try {
      const planInputs = this.extractPlanInputs(context, message)
      
      // Get research data
      const research = await researchIndustry({
        industry: planInputs.business.industry,
        country: planInputs.business.location.country,
        state: planInputs.business.location.state,
        county: planInputs.business.location.county
      })
      
      // Call AI model to generate market analysis
      const response = await callModel<MarketAnalysisType>({
        model: 'claude-3-5-sonnet',
        system: `You are a market analyst. Using the business industry and location, return five sections:
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
}`,
        user: `Inputs: ${JSON.stringify(planInputs, null, 2)}

Research Context:
- Industry Trends: ${research.trends.join(', ')}
- Competitor Activity: ${research.competitors.join(', ')}
- Seasonal Patterns: ${research.seasonal.join(', ')}`
      })
      
      const market = response.data
      
      this.logActivity('Market analysis completed', { market })
      
      return this.createTerminalResponse(
        `📊 **Market Analysis Complete!**

**Industry Trends:**
${market.industryTrends.map(trend => `• ${trend}`).join('\n')}

**Growth Opportunities:**
${market.growthOpportunities.map(opp => `• **${opp.label}**: ${opp.rationale}`).join('\n')}

**Next Step:** Select the opportunities you want to pursue.`,
        { 
          market,
          type: 'market_analysis',
          status: 'completed'
        }
      )
      
    } catch (error) {
      this.logActivity('Error in market analysis', { error: error.message })
      return this.createResponse(`❌ Error completing market analysis: ${error.message}`)
    }
  }
  
  private extractPlanInputs(context: any, message: string): PlanInputsType {
    if (context?.planInputs) {
      return context.planInputs
    }
    
    // Default fallback
    return {
      revenueGoal90d: 30000,
      customerGoal90d: 60,
      challenges: [],
      availabilityHrsPerWeek: 20,
      business: {
        name: "Sample Business",
        industry: "Technology",
        location: { country: "US" }
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }
}

// Strategy Agent
export class StrategyAgent extends StrategicPlanningAgent {
  constructor() {
    super(
      'strategy-agent',
      'Strategy Agent',
      'Creates strategic initiatives and action plans',
      ['strategy_development', 'initiative_planning', 'feasibility_analysis']
    )
  }
  
  async process(message: string, context?: any): Promise<AgentResponse> {
    this.logActivity('Processing strategy development request', { message: message.substring(0, 100) })
    
    try {
      const { okr, selectedOpportunities, planInputs } = this.extractStrategyContext(context, message)
      
      // Call AI model to generate strategy
      const response = await callModel<StrategyPlanType>({
        model: 'claude-3-5-sonnet',
        system: `You are a business strategist. Convert OKRs and selected opportunities into an actionable plan. Create initiatives with priority and dependencies. Include a lineOfAction sequence. Tie each initiative to KR ids. Ensure feasibility given availability and a 90-day timeline.

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
      "riskNotes": "string"
    }
  ],
  "lineOfAction": ["init-1", "init-2"],
  "feasibilityNotes": "string"
}`,
        user: `OKR: ${JSON.stringify(okr, null, 2)}
Selected opportunities: ${JSON.stringify(selectedOpportunities, null, 2)}
Inputs: ${JSON.stringify(planInputs, null, 2)}`
      })
      
      const strategy = response.data
      
      this.logActivity('Strategy development completed', { strategy })
      
      return this.createTerminalResponse(
        `🎯 **Strategic Plan Created!**

**Initiatives:**
${strategy.initiatives.map(init => `• **${init.title}** (Priority ${init.priority}): ${init.description}`).join('\n')}

**Execution Sequence:** ${strategy.lineOfAction.join(' → ')}

**Feasibility:** ${strategy.feasibilityNotes}

Your strategic plan is ready for review and approval.`,
        { 
          strategy,
          type: 'strategy_plan',
          status: 'completed'
        }
      )
      
    } catch (error) {
      this.logActivity('Error in strategy development', { error: error.message })
      return this.createResponse(`❌ Error creating strategic plan: ${error.message}`)
    }
  }
  
  private extractStrategyContext(context: any, message: string): any {
    return {
      okr: context?.okr || {},
      selectedOpportunities: context?.selectedOpportunities || [],
      planInputs: context?.planInputs || {}
    }
  }
}

// Project Manager Agent
export class ProjectManagerAgent extends StrategicPlanningAgent {
  constructor() {
    super(
      'project-manager',
      'Project Manager',
      'Creates project roadmaps and timelines',
      ['roadmap_creation', 'timeline_planning', 'dependency_mapping']
    )
  }
  
  async process(message: string, context?: any): Promise<AgentResponse> {
    this.logActivity('Processing roadmap creation request', { message: message.substring(0, 100) })
    
    try {
      const { strategy, okr, planInputs } = this.extractRoadmapContext(context, message)
      
      // Call AI model to generate roadmap
      const response = await callModel<RoadmapRowType[]>({
        model: 'claude-3-5-sonnet',
        system: `You are a project scheduler. Convert initiatives and lineOfAction into a 90-day roadmap. Each row includes initiative, ISO start and end dates, dependencies, and a metric from mapped KRs. Respect availability hours per week.

Return JSON array matching this schema:
[
  {
    "initiativeId": "init-1",
    "initiative": "string",
    "start": "2025-01-01",
    "end": "2025-01-15",
    "dependencies": [],
    "metric": "string"
  }
]`,
        user: `Strategy: ${JSON.stringify(strategy, null, 2)}
OKR: ${JSON.stringify(okr, null, 2)}
Inputs: ${JSON.stringify(planInputs, null, 2)}`
      })
      
      const roadmap = response.data
      
      this.logActivity('Roadmap creation completed', { roadmap })
      
      return this.createTerminalResponse(
        `🗓️ **90-Day Roadmap Created!**

**Timeline:**
${roadmap.map(row => `• **${row.initiative}** (${row.start} to ${row.end})
  Metric: ${row.metric}
  Dependencies: ${row.dependencies.length > 0 ? row.dependencies.join(', ') : 'None'}`).join('\n\n')}

Your roadmap is ready for review and approval.`,
        { 
          roadmap,
          type: 'roadmap',
          status: 'completed'
        }
      )
      
    } catch (error) {
      this.logActivity('Error in roadmap creation', { error: error.message })
      return this.createResponse(`❌ Error creating roadmap: ${error.message}`)
    }
  }
  
  private extractRoadmapContext(context: any, message: string): any {
    return {
      strategy: context?.strategy || {},
      okr: context?.okr || {},
      planInputs: context?.planInputs || {}
    }
  }
}

// Agent Factory for Strategic Planning
export class StrategicPlanningAgentFactory {
  static createOKRPlanner(): OKRPlannerAgent {
    return new OKRPlannerAgent()
  }
  
  static createMarketAnalyst(): MarketAnalystAgent {
    return new MarketAnalystAgent()
  }
  
  static createStrategyAgent(): StrategyAgent {
    return new StrategyAgent()
  }
  
  static createProjectManager(): ProjectManagerAgent {
    return new ProjectManagerAgent()
  }
  
  static createStrategicPlanningTeam(): Agent[] {
    return [
      this.createOKRPlanner(),
      this.createMarketAnalyst(),
      this.createStrategyAgent(),
      this.createProjectManager()
    ]
  }
}

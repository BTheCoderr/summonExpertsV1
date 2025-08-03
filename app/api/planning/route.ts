// Planning Agent - Handles strategic planning and analysis tasks
import { NextRequest, NextResponse } from 'next/server';
import { AgentResponse } from '@/lib/agent-types';
import memoryManager from '@/lib/memory';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { action, parameters, timestamp } = body;
    
    let result: any;
    
    switch (action) {
      case 'parse_task_requirements':
        result = await parseTaskRequirements(parameters);
        break;
        
      case 'create_analysis_plan':
        result = await createAnalysisPlan(parameters);
        break;
        
      case 'create_strategic_plan':
        result = await createStrategicPlan(parameters);
        break;
        
      case 'general_processing':
        result = await generalProcessing(parameters);
        break;
        
      default:
        throw new Error(`Unknown planning action: ${action}`);
    }
    
    // Record metrics
    const executionTime = Date.now() - startTime;
    await memoryManager.recordAgentMetrics('planning', {
      executionTime,
      success: true
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        agent: 'planning',
        executionTime,
        action,
        confidence: 0.9
      }
    } as AgentResponse);
    
  } catch (error) {
    console.error('Planning agent error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        agent: 'planning',
        executionTime: Date.now() - startTime
      }
    } as AgentResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Planning Agent is running',
    capabilities: [
      'Task requirement parsing',
      'Strategic plan creation',
      'Analysis planning',
      'Business framework application',
      'Goal setting and prioritization'
    ],
    actions: [
      'parse_task_requirements',
      'create_analysis_plan', 
      'create_strategic_plan',
      'general_processing'
    ]
  });
}

// Parse task requirements from user input
async function parseTaskRequirements(parameters: any) {
  const { command, context } = parameters;
  
  // Extract key information from command
  const taskInfo = {
    title: extractTaskTitle(command),
    priority: extractPriority(command),
    assignee: extractAssignee(command),
    dueDate: extractDueDate(command),
    description: command,
    tags: extractTags(command),
    subtasks: generateSubtasks(command),
    estimatedEffort: estimateEffort(command)
  };
  
  return {
    taskInfo,
    requirements: {
      clear: taskInfo.title !== 'Unknown Task',
      complete: taskInfo.description.length > 10,
      actionable: taskInfo.subtasks.length > 0
    },
    recommendations: generateTaskRecommendations(taskInfo)
  };
}

// Create analysis plan for business analysis
async function createAnalysisPlan(parameters: any) {
  const { command, context } = parameters;
  
  const analysisPlan = {
    type: determineAnalysisType(command),
    scope: determineScope(command),
    dataRequirements: determineDataRequirements(command),
    methodology: determineMethodology(command),
    deliverables: determineDeliverables(command),
    timeline: estimateTimeline(command),
    resources: determineResources(command)
  };
  
  return {
    plan: analysisPlan,
    steps: generateAnalysisSteps(analysisPlan),
    successCriteria: defineSuccessCriteria(analysisPlan)
  };
}

// Create strategic business plan
async function createStrategicPlan(parameters: any) {
  const { command, context } = parameters;
  
  const strategicPlan = {
    businessModel: extractBusinessModel(command),
    marketAnalysis: {
      targetMarket: extractTargetMarket(command),
      competitors: identifyCompetitors(command),
      marketSize: estimateMarketSize(command),
      trends: identifyTrends(command)
    },
    financialProjections: {
      revenue: estimateRevenue(command),
      costs: estimateCosts(command),
      timeline: createFinancialTimeline(command)
    },
    strategicPillars: generateStrategicPillars(command),
    implementation: createImplementationPlan(command),
    risks: identifyRisks(command)
  };
  
  return {
    plan: strategicPlan,
    executiveSummary: generateExecutiveSummary(strategicPlan),
    nextSteps: determineNextSteps(strategicPlan)
  };
}

// General processing for unknown commands
async function generalProcessing(parameters: any) {
  const { command, context } = parameters;
  
  return {
    intent: analyzeIntent(command),
    suggestedActions: suggestActions(command),
    context: extractContext(command),
    confidence: calculateConfidence(command)
  };
}

// Helper functions for task parsing
function extractTaskTitle(command: string): string {
  const titlePatterns = [
    /create task: (.+)/i,
    /add task: (.+)/i,
    /new task: (.+)/i,
    /task: (.+)/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = command.match(pattern);
    if (match) return match[1].trim();
  }
  
  // Fallback: extract first meaningful phrase
  const words = command.split(' ').slice(0, 5);
  return words.join(' ') || 'Unknown Task';
}

function extractPriority(command: string): 'low' | 'medium' | 'high' {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('urgent') || lowerCommand.includes('high priority') || lowerCommand.includes('asap')) {
    return 'high';
  }
  if (lowerCommand.includes('low priority') || lowerCommand.includes('when possible')) {
    return 'low';
  }
  return 'medium';
}

function extractAssignee(command: string): string | undefined {
  const assigneePatterns = [
    /assign to (.+)/i,
    /for (.+)/i,
    /@(.+)/i
  ];
  
  for (const pattern of assigneePatterns) {
    const match = command.match(pattern);
    if (match) return match[1].trim();
  }
  
  return undefined;
}

function extractDueDate(command: string): string | undefined {
  const datePatterns = [
    /due (.+)/i,
    /by (.+)/i,
    /deadline (.+)/i
  ];
  
  for (const pattern of datePatterns) {
    const match = command.match(pattern);
    if (match) return match[1].trim();
  }
  
  return undefined;
}

function extractTags(command: string): string[] {
  const tags: string[] = [];
  const tagPattern = /#(\w+)/g;
  let match;
  
  while ((match = tagPattern.exec(command)) !== null) {
    tags.push(match[1]);
  }
  
  return tags;
}

function generateSubtasks(command: string): string[] {
  const subtasks: string[] = [];
  const subtaskPatterns = [
    /- (.+)/g,
    /• (.+)/g,
    /\* (.+)/g
  ];
  
  for (const pattern of subtaskPatterns) {
    let match;
    while ((match = pattern.exec(command)) !== null) {
      subtasks.push(match[1].trim());
    }
  }
  
  // Generate default subtasks if none found
  if (subtasks.length === 0) {
    subtasks.push('Research requirements');
    subtasks.push('Create initial draft');
    subtasks.push('Review and refine');
  }
  
  return subtasks;
}

function estimateEffort(command: string): string {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('quick') || lowerCommand.includes('simple') || lowerCommand.includes('easy')) {
    return '1-2 hours';
  }
  if (lowerCommand.includes('complex') || lowerCommand.includes('detailed') || lowerCommand.includes('comprehensive')) {
    return '1-2 days';
  }
  return '4-8 hours';
}

// Helper functions for analysis planning
function determineAnalysisType(command: string): string {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('market')) return 'market_analysis';
  if (lowerCommand.includes('financial')) return 'financial_analysis';
  if (lowerCommand.includes('competitor')) return 'competitive_analysis';
  if (lowerCommand.includes('swot')) return 'swot_analysis';
  return 'general_analysis';
}

function determineScope(command: string): string {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('comprehensive') || lowerCommand.includes('detailed')) return 'comprehensive';
  if (lowerCommand.includes('quick') || lowerCommand.includes('overview')) return 'overview';
  return 'standard';
}

function determineDataRequirements(command: string): string[] {
  return [
    'Market data',
    'Financial information',
    'Competitor analysis',
    'Customer insights'
  ];
}

function determineMethodology(command: string): string {
  return 'Mixed methods approach combining quantitative and qualitative analysis';
}

function determineDeliverables(command: string): string[] {
  return [
    'Executive summary',
    'Detailed analysis report',
    'Recommendations',
    'Action plan'
  ];
}

function estimateTimeline(command: string): string {
  return '1-2 weeks';
}

function determineResources(command: string): string[] {
  return [
    'Market research tools',
    'Financial modeling software',
    'Analytics platform',
    'Expert consultation'
  ];
}

// Helper functions for strategic planning
function extractBusinessModel(command: string): string {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('saas') || lowerCommand.includes('software')) return 'SaaS';
  if (lowerCommand.includes('ecommerce') || lowerCommand.includes('retail')) return 'E-commerce';
  if (lowerCommand.includes('consulting') || lowerCommand.includes('service')) return 'Consulting';
  return 'General Business';
}

function extractTargetMarket(command: string): string {
  return 'To be defined based on business model';
}

function identifyCompetitors(command: string): string[] {
  return ['Competitor 1', 'Competitor 2', 'Competitor 3'];
}

function estimateMarketSize(command: string): string {
  return 'Market size analysis required';
}

function identifyTrends(command: string): string[] {
  return ['Digital transformation', 'AI integration', 'Sustainability'];
}

function estimateRevenue(command: string): any {
  return {
    year1: '$100K - $500K',
    year3: '$1M - $5M',
    year5: '$5M - $20M'
  };
}

function estimateCosts(command: string): any {
  return {
    operational: '40-60% of revenue',
    marketing: '15-25% of revenue',
    technology: '10-20% of revenue'
  };
}

function createFinancialTimeline(command: string): any {
  return {
    phase1: 'Months 1-6: Seed funding and MVP',
    phase2: 'Months 7-12: Series A and scaling',
    phase3: 'Months 13-24: Market expansion'
  };
}

function generateStrategicPillars(command: string): any[] {
  return [
    {
      name: 'Market Positioning',
      description: 'Establish unique market position',
      objectives: ['Define value proposition', 'Identify target segments']
    },
    {
      name: 'Operational Excellence',
      description: 'Optimize business operations',
      objectives: ['Streamline processes', 'Improve efficiency']
    },
    {
      name: 'Technology Innovation',
      description: 'Leverage technology for competitive advantage',
      objectives: ['Digital transformation', 'AI integration']
    }
  ];
}

function createImplementationPlan(command: string): any {
  return {
    phase1: {
      name: 'Foundation',
      duration: '6 months',
      objectives: ['Business setup', 'MVP development']
    },
    phase2: {
      name: 'Growth',
      duration: '12 months',
      objectives: ['Market entry', 'Customer acquisition']
    },
    phase3: {
      name: 'Scale',
      duration: '18 months',
      objectives: ['Market expansion', 'Team scaling']
    }
  };
}

function identifyRisks(command: string): any[] {
  return [
    {
      category: 'Market',
      description: 'Market competition and saturation',
      probability: 'medium',
      impact: 'high'
    },
    {
      category: 'Technology',
      description: 'Technology obsolescence',
      probability: 'low',
      impact: 'medium'
    },
    {
      category: 'Financial',
      description: 'Funding and cash flow challenges',
      probability: 'medium',
      impact: 'high'
    }
  ];
}

// Additional helper functions
function generateTaskRecommendations(taskInfo: any): string[] {
  const recommendations = [];
  
  if (!taskInfo.assignee) {
    recommendations.push('Consider assigning to a team member');
  }
  
  if (!taskInfo.dueDate) {
    recommendations.push('Set a specific deadline for accountability');
  }
  
  if (taskInfo.subtasks.length < 3) {
    recommendations.push('Break down into smaller, actionable subtasks');
  }
  
  return recommendations;
}

function generateAnalysisSteps(plan: any): any[] {
  return [
    { step: 1, action: 'Data collection', duration: '3-5 days' },
    { step: 2, action: 'Data analysis', duration: '2-3 days' },
    { step: 3, action: 'Report generation', duration: '1-2 days' },
    { step: 4, action: 'Review and refinement', duration: '1 day' }
  ];
}

function defineSuccessCriteria(plan: any): string[] {
  return [
    'Clear understanding of market dynamics',
    'Actionable insights and recommendations',
    'Comprehensive analysis report',
    'Stakeholder buy-in and approval'
  ];
}

function generateExecutiveSummary(plan: any): string {
  return `Strategic plan for ${plan.businessModel} business model with focus on ${plan.marketAnalysis.targetMarket}. Projected revenue growth from ${plan.financialProjections.revenue.year1} to ${plan.financialProjections.revenue.year5} with strategic pillars in ${plan.strategicPillars.map((p: any) => p.name).join(', ')}.`;
}

function determineNextSteps(plan: any): string[] {
  return [
    'Validate business model assumptions',
    'Conduct market research',
    'Develop MVP',
    'Secure initial funding',
    'Build core team'
  ];
}

function analyzeIntent(command: string): string {
  const lowerCommand = command.toLowerCase();
  if (lowerCommand.includes('plan') || lowerCommand.includes('strategy')) return 'planning';
  if (lowerCommand.includes('analyze') || lowerCommand.includes('research')) return 'analysis';
  if (lowerCommand.includes('create') || lowerCommand.includes('build')) return 'creation';
  return 'general';
}

function suggestActions(command: string): string[] {
  return [
    'Create detailed project plan',
    'Set up project timeline',
    'Assign team responsibilities',
    'Define success metrics'
  ];
}

function extractContext(command: string): any {
  return {
    businessType: extractBusinessModel(command),
    urgency: extractPriority(command),
    complexity: command.length > 100 ? 'high' : 'medium'
  };
}

function calculateConfidence(command: string): number {
  // Simple confidence calculation based on command clarity
  const clarity = command.length / 200; // Normalize by expected length
  return Math.min(Math.max(clarity, 0.3), 0.9);
} 
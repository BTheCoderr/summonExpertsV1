// Main Orchestrator Agent - Routes commands to appropriate sub-agents
import { NextRequest, NextResponse } from 'next/server';
import { memoryManager } from '@/lib/memory';
import { fleetManager } from '@/lib/agent-fleet';
import { securityManager } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { command, context, sessionId } = await request.json();
    
    // Security validation
    const authResult = await securityManager.validateRequest(request);
    if (!authResult.valid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await securityManager.checkSessionRateLimit(sessionId);
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse command intent
    const intent = await parseCommandIntent(command);
    
    // Create execution plan
    const plan = await createExecutionPlan(intent, context);
    
    // Execute plan with real agents
    const results = await executePlan(plan, sessionId);
    
    // Update memory
    await memoryManager.setSessionContext(sessionId, {
      shortTerm: {
        contextData: results,
        recentCommands: [command]
      }
    });

    // Log audit trail
    await securityManager.logAuditTrail({
      sessionId,
      action: 'command_execution',
      command,
      result: results,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: results,
      metadata: {
        intent,
        plan,
        executionTime: Date.now()
      }
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

async function parseCommandIntent(command: string) {
  // Use Claude to parse command intent
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/claude`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `Parse this command and return JSON with intent and parameters: "${command}"`,
      system: 'You are a command parser. Return only valid JSON with intent and parameters fields.'
    })
  });
  
  const result = await response.json();
  return result.data?.content ? JSON.parse(result.data.content) : { intent: 'unknown', parameters: {} };
}

async function createExecutionPlan(intent: any, context: any) {
  const plan: { steps: any[]; estimatedTime: number } = {
    steps: [],
    estimatedTime: 0
  };

  switch (intent.intent) {
    case 'summarize':
      plan.steps = [
        { agent: 'notion', action: 'read_page', parameters: { pageId: context.pageId } },
        { agent: 'claude', action: 'summarize', parameters: { content: '{{notion.content}}' } }
      ];
      break;
      
    case 'create_task':
      plan.steps = [
        { agent: 'planning', action: 'analyze_task', parameters: { task: intent.parameters.task } },
        { agent: 'notion', action: 'create_page', parameters: { databaseId: context.databaseId, properties: '{{planning.properties}}' } }
      ];
      break;
      
    case 'analyze_business':
      plan.steps = [
        { agent: 'notion', action: 'query_database', parameters: { databaseId: context.databaseId } },
        { agent: 'claude', action: 'analyze', parameters: { data: '{{notion.data}}' } },
        { agent: 'gpt', action: 'generate_insights', parameters: { analysis: '{{claude.analysis}}' } }
      ];
      break;
  }

  return plan;
}

async function executePlan(plan: any, sessionId: string) {
  const results: Record<string, any> = {};
  
  for (const step of plan.steps) {
    try {
      // Get available agent instance
      const agentInstance = await fleetManager.getAvailableAgent(step.agent);
      if (!agentInstance) {
        throw new Error(`No available ${step.agent} agent`);
      }

      // Execute step
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${step.agent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...step.parameters,
          sessionId
        })
      });

      const result = await response.json();
      results[step.agent] = result.data;

      // Update agent metrics
      await fleetManager.updateAgentMetrics(agentInstance.id, {
        requestsProcessed: agentInstance.metrics.requestsProcessed + 1,
        averageResponseTime: Date.now() - Date.now(), // Calculate actual time
        costPerRequest: 0.01 // Calculate actual cost
      });

    } catch (error) {
      console.error(`Step execution failed:`, error);
      results[step.agent] = { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  return results;
}

export async function GET() {
  return NextResponse.json({ status: 'Orchestrator ready' });
} 
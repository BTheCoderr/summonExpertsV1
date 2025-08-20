import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agent-orchestrator';

export async function POST(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { agent } = params;
    const body = await request.json();
    const { input, config } = body;

    // Validate agent type
    const validAgents = ['planner', 'tracker', 'guide', 'marketing', 'finance', 'dev', 'ops'];
    if (!validAgents.includes(agent)) {
      return NextResponse.json(
        { error: `Invalid agent: ${agent}. Valid agents are: ${validAgents.join(', ')}` },
        { status: 400 }
      );
    }

    // Initialize orchestrator
    const orchestrator = new AgentOrchestrator({
      project_id: config?.project_id,
      auto_tracking: false,
      auto_escalation: false,
      notification_channels: config?.notification_channels || ['in_app']
    });

    // Execute the specific agent
    const result = await orchestrator.executeAgent(agent, input);

    return NextResponse.json({
      success: true,
      agent,
      data: result
    });

  } catch (error) {
    console.error(`Agent ${params.agent} execution failed:`, error);
    
    return NextResponse.json(
      { 
        error: `Agent ${params.agent} execution failed`,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { agent } = params;
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');

    // Initialize orchestrator
    const orchestrator = new AgentOrchestrator({
      project_id: project_id || undefined,
      auto_tracking: false,
      auto_escalation: false,
      notification_channels: []
    });

    // Get agent status
    const status = await orchestrator.getAgentStatus();

    return NextResponse.json({
      success: true,
      agent,
      data: status
    });

  } catch (error) {
    console.error(`Failed to get agent ${params.agent} status:`, error);
    
    return NextResponse.json(
      { 
        error: `Failed to get agent ${params.agent} status`,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

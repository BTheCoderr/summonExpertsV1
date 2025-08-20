import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agent-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal, constraints, target_date, context, config } = body;

    // Validate required fields
    if (!goal || !target_date) {
      return NextResponse.json(
        { error: 'Missing required fields: goal and target_date are required' },
        { status: 400 }
      );
    }

    // Initialize orchestrator with configuration
    const orchestrator = new AgentOrchestrator({
      auto_tracking: config?.auto_tracking ?? true,
      auto_escalation: config?.auto_escalation ?? true,
      notification_channels: config?.notification_channels ?? ['in_app']
    });

    // Execute the workflow
    const result = await orchestrator.orchestrateWorkflow({
      goal,
      constraints: constraints || [],
      target_date,
      context: context || {}
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Agent orchestration failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Agent orchestration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Initialize orchestrator
    const orchestrator = new AgentOrchestrator({
      project_id,
      auto_tracking: false,
      auto_escalation: false,
      notification_channels: []
    });

    // Get project summary
    const summary = await orchestrator.getProjectSummary();

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Failed to get project summary:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get project summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

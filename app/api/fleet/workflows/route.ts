import { NextRequest, NextResponse } from 'next/server';
import { fleetManager } from '@/lib/agent-fleet';

export async function GET(request: NextRequest) {
  try {
    // Mock workflow executions for now - replace with real fleet data
    const executions = [
      {
        id: 'workflow_1',
        name: 'Business Plan Analysis',
        status: 'running',
        progress: 65,
        startTime: new Date(Date.now() - 300000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 180000).toISOString()
      },
      {
        id: 'workflow_2',
        name: 'Market Research Summary',
        status: 'pending',
        progress: 0,
        startTime: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 600000).toISOString()
      },
      {
        id: 'workflow_3',
        name: 'Financial Projections',
        status: 'completed',
        progress: 100,
        startTime: new Date(Date.now() - 900000).toISOString(),
        estimatedCompletion: new Date(Date.now() - 100000).toISOString()
      }
    ];
    
    return NextResponse.json({ executions });
  } catch (error) {
    console.error('Workflows data error:', error);
    return NextResponse.json({ error: 'Failed to get workflows data' }, { status: 500 });
  }
} 
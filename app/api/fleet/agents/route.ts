import { NextRequest, NextResponse } from 'next/server';
import { fleetManager } from '@/lib/agent-fleet';

export async function GET(request: NextRequest) {
  try {
    // Mock agent instances for now - replace with real fleet data
    const instances = [
      {
        id: 'agent_1',
        type: 'orchestrator',
        status: 'idle',
        health: {
          responseTime: 150,
          successRate: 99.8,
          lastHeartbeat: Date.now()
        },
        load: {
          currentRequests: 0,
          maxConcurrentRequests: 10
        },
        metrics: {
          costPerRequest: 0.02,
          requestsProcessed: 1250
        }
      },
      {
        id: 'agent_2',
        type: 'planning',
        status: 'busy',
        health: {
          responseTime: 320,
          successRate: 98.5,
          lastHeartbeat: Date.now()
        },
        load: {
          currentRequests: 3,
          maxConcurrentRequests: 5
        },
        metrics: {
          costPerRequest: 0.05,
          requestsProcessed: 890
        }
      },
      {
        id: 'agent_3',
        type: 'claude',
        status: 'busy',
        health: {
          responseTime: 1200,
          successRate: 97.2,
          lastHeartbeat: Date.now()
        },
        load: {
          currentRequests: 2,
          maxConcurrentRequests: 3
        },
        metrics: {
          costPerRequest: 0.15,
          requestsProcessed: 450
        }
      }
    ];
    
    return NextResponse.json({ instances });
  } catch (error) {
    console.error('Agents data error:', error);
    return NextResponse.json({ error: 'Failed to get agents data' }, { status: 500 });
  }
} 
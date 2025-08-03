import { NextRequest, NextResponse } from 'next/server';
import { fleetManager } from '@/lib/agent-fleet';

export async function GET(request: NextRequest) {
  try {
    const status = fleetManager.getFleetStatus();
    
    return NextResponse.json({
      totalInstances: status.totalInstances,
      activeInstances: Object.values(status.instancesByType).reduce((a, b) => a + b, 0),
      totalCost: status.totalCost,
      averageResponseTime: 250, // Calculate from actual metrics
      successRate: 98.5 // Calculate from actual metrics
    });
  } catch (error) {
    console.error('Fleet status error:', error);
    return NextResponse.json({ error: 'Failed to get fleet status' }, { status: 500 });
  }
} 
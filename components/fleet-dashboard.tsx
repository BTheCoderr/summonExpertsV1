'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  Database,
  Cpu,
  Network
} from 'lucide-react';

interface AgentInstance {
  id: string;
  type: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  health: {
    responseTime: number;
    successRate: number;
    lastHeartbeat: number;
  };
  load: {
    currentRequests: number;
    maxConcurrentRequests: number;
  };
  metrics: {
    costPerRequest: number;
    requestsProcessed: number;
  };
}

interface WorkflowExecution {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
}

export default function FleetDashboard() {
  const [agentInstances, setAgentInstances] = useState<AgentInstance[]>([]);
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([]);
  const [fleetStats, setFleetStats] = useState({
    totalInstances: 0,
    activeInstances: 0,
    totalCost: 0,
    averageResponseTime: 0,
    successRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFleetData();
    const interval = setInterval(fetchFleetData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFleetData = async () => {
    try {
      // Fetch fleet status
      const fleetResponse = await fetch('/api/fleet/status');
      const fleetData = await fleetResponse.json();
      
      // Fetch agent instances
      const agentsResponse = await fetch('/api/fleet/agents');
      const agentsData = await agentsResponse.json();
      
      // Fetch workflow executions
      const workflowsResponse = await fetch('/api/fleet/workflows');
      const workflowsData = await workflowsResponse.json();

      setFleetStats(fleetData);
      setAgentInstances(agentsData.instances || []);
      setWorkflowExecutions(workflowsData.executions || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch fleet data:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;
  const formatTime = (time: number) => `${time}ms`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Agent Fleet Dashboard</h1>
          <p className="text-gray-300">Real-time monitoring and management of your AI agent fleet</p>
        </div>

        {/* Fleet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium glass-text-white">Total Agents</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold glass-text-white">{fleetStats.totalInstances}</div>
              <p className="text-xs text-muted-foreground">
                {fleetStats.activeInstances} active
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium glass-text-white">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold glass-text-white">{fleetStats.successRate}%</div>
              <Progress value={fleetStats.successRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium glass-text-white">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold glass-text-white">{formatTime(fleetStats.averageResponseTime)}</div>
              <p className="text-xs text-muted-foreground">
                Target: &lt;500ms
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium glass-text-white">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold glass-text-white">{formatCost(fleetStats.totalCost)}</div>
              <p className="text-xs text-muted-foreground">
                This session
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agent Instances */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="glass-text-white flex items-center gap-2">
              <Server className="h-5 w-5" />
              Agent Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentInstances.map(agent => (
                <div key={agent.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="glass-text-white font-medium">{agent.type}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(agent.status)} text-white`}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="glass-text-teal">Response Time</span>
                      <span className="glass-text-white">{formatTime(agent.health.responseTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="glass-text-teal">Success Rate</span>
                      <span className="glass-text-white">{agent.health.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="glass-text-teal">Load</span>
                      <span className="glass-text-white">
                        {agent.load.currentRequests}/{agent.load.maxConcurrentRequests}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="glass-text-teal">Cost</span>
                      <span className="glass-text-white">{formatCost(agent.metrics.costPerRequest)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Executions */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="glass-text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflowExecutions.map(workflow => (
                <div key={workflow.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="glass-text-white font-medium">{workflow.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(workflow.status)} text-white`}
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="glass-text-teal">Progress</span>
                      <span className="glass-text-white">{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Started: {new Date(workflow.startTime).toLocaleTimeString()}</span>
                      <span>ETA: {new Date(workflow.estimatedCompletion).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Resources */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="glass-text-white flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="glass-text-teal">CPU Usage</span>
                  <span className="glass-text-white">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="glass-text-teal">Memory Usage</span>
                  <span className="glass-text-white">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="glass-text-teal">Network I/O</span>
                  <span className="glass-text-white">28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
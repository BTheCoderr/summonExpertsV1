// Agent Fleet Management System
import { AgentType, AgentConfig, AgentCapabilities } from './agent-types';

export interface AgentInstance {
  id: string;
  type: AgentType;
  status: 'idle' | 'busy' | 'error' | 'offline';
  health: {
    lastHeartbeat: number;
    responseTime: number;
    errorCount: number;
    successRate: number;
  };
  metrics: {
    requestsProcessed: number;
    averageResponseTime: number;
    costPerRequest: number;
    tokensUsed: number;
  };
  load: {
    currentRequests: number;
    maxConcurrentRequests: number;
    queueLength: number;
  };
  location: string; // For distributed deployment
  version: string;
  createdAt: number;
  lastUsed: number;
}

export interface FleetConfig {
  maxInstancesPerType: number;
  minInstancesPerType: number;
  autoScaling: {
    enabled: boolean;
    scaleUpThreshold: number; // CPU/load percentage
    scaleDownThreshold: number;
    cooldownPeriod: number; // seconds
  };
  healthCheck: {
    interval: number; // seconds
    timeout: number; // seconds
    maxFailures: number;
  };
  loadBalancing: {
    strategy: 'round-robin' | 'least-loaded' | 'fastest-response' | 'cost-optimized';
    stickySessions: boolean;
  };
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  retryPolicy: RetryPolicy;
  timeout: number; // seconds
  version: string;
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string; // Added for UI support
  agentType: AgentType;
  action: string;
  parameters: Record<string, any>;
  conditions?: WorkflowCondition[];
  dependencies?: string[]; // Step IDs this depends on
  timeout?: number;
  retryCount?: number;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'exists';
  value: any;
}

export interface WorkflowTrigger {
  type: 'webhook' | 'schedule' | 'event' | 'manual';
  config: Record<string, any>;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoff: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep: string;
  steps: WorkflowStepExecution[];
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
  startedAt: number;
  completedAt?: number;
  cost: number;
  tokensUsed: number;
}

export interface WorkflowStepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  agentInstanceId: string;
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
  startedAt: number;
  completedAt?: number;
  retryCount: number;
  cost: number;
  tokensUsed: number;
}

class AgentFleetManager {
  private instances: Map<string, AgentInstance> = new Map();
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private config: FleetConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private autoScalingInterval: NodeJS.Timeout | null = null;

  constructor(config: FleetConfig) {
    this.config = config;
    this.startHealthChecks();
    this.startAutoScaling();
  }

  // Agent Instance Management
  async registerAgentInstance(instance: Omit<AgentInstance, 'id' | 'createdAt'>): Promise<string> {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agentInstance: AgentInstance = {
      ...instance,
      id,
      createdAt: Date.now(),
      lastUsed: Date.now()
    };

    this.instances.set(id, agentInstance);
    console.log(`Registered agent instance: ${id} (${instance.type})`);
    return id;
  }

  async deregisterAgentInstance(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) {
      this.instances.delete(instanceId);
      console.log(`Deregistered agent instance: ${instanceId}`);
    }
  }

  async getAvailableAgent(type: AgentType, strategy: 'round-robin' | 'least-loaded' | 'fastest-response' | 'cost-optimized' = 'least-loaded'): Promise<AgentInstance | null> {
    const availableInstances = Array.from(this.instances.values())
      .filter(instance => 
        instance.type === type && 
        instance.status === 'idle' && 
        instance.load.currentRequests < instance.load.maxConcurrentRequests
      );

    if (availableInstances.length === 0) {
      return null;
    }

    switch (strategy) {
      case 'round-robin':
        return availableInstances[Math.floor(Math.random() * availableInstances.length)];
      
      case 'least-loaded':
        return availableInstances.reduce((min, current) => 
          current.load.currentRequests < min.load.currentRequests ? current : min
        );
      
      case 'fastest-response':
        return availableInstances.reduce((fastest, current) => 
          current.health.responseTime < fastest.health.responseTime ? current : fastest
        );
      
      case 'cost-optimized':
        return availableInstances.reduce((cheapest, current) => 
          current.metrics.costPerRequest < cheapest.metrics.costPerRequest ? current : cheapest
        );
      
      default:
        return availableInstances[0];
    }
  }

  async updateAgentHealth(instanceId: string, health: Partial<AgentInstance['health']>): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.health = { ...instance.health, ...health, lastHeartbeat: Date.now() };
      instance.lastUsed = Date.now();
    }
  }

  async updateAgentMetrics(instanceId: string, metrics: Partial<AgentInstance['metrics']>): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.metrics = { ...instance.metrics, ...metrics };
    }
  }

  async updateAgentLoad(instanceId: string, load: Partial<AgentInstance['load']>): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.load = { ...instance.load, ...load };
    }
  }

  // Health Checks
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheck.interval * 1000);
  }

  private async performHealthChecks(): Promise<void> {
    const now = Date.now();
    const timeout = this.config.healthCheck.timeout * 1000;

    for (const [instanceId, instance] of Array.from(this.instances.entries())) {
      const timeSinceHeartbeat = now - instance.health.lastHeartbeat;
      
      if (timeSinceHeartbeat > timeout) {
        console.warn(`Agent instance ${instanceId} has not responded for ${timeSinceHeartbeat}ms`);
        await this.handleAgentFailure(instanceId);
      }
    }
  }

  private async handleAgentFailure(instanceId: string): Promise<void> {
    // Auto-recovery: Try to restart or replace the agent
    const instance = this.instances.get(instanceId);
    if (instance) {
      console.log(`Attempting auto-recovery for agent ${instanceId}`);
      
      // Reset health metrics
      instance.health.errorCount = 0;
      instance.health.lastHeartbeat = Date.now();
      instance.status = 'idle';
      
      // If auto-recovery fails, mark as permanently offline
      setTimeout(() => {
        const currentInstance = this.instances.get(instanceId);
        if (currentInstance && currentInstance.status === 'offline') {
          console.log(`Agent ${instanceId} auto-recovery failed, removing from fleet`);
          this.instances.delete(instanceId);
        }
      }, 30000); // 30 second recovery window
    }
  }

  // Auto Scaling
  private startAutoScaling(): void {
    this.autoScalingInterval = setInterval(() => {
      this.performAutoScaling();
    }, this.config.autoScaling.cooldownPeriod * 1000);
  }

  private async performAutoScaling(): Promise<void> {
    const agentTypes = new Set(Array.from(this.instances.values()).map(i => i.type));
    
    for (const agentType of Array.from(agentTypes)) {
      const instances = Array.from(this.instances.values()).filter(i => i.type === agentType);
      const avgLoad = instances.reduce((sum, i) => sum + i.load.currentRequests, 0) / instances.length;
      const avgResponseTime = instances.reduce((sum, i) => sum + i.health.responseTime, 0) / instances.length;
      
      if (avgLoad > this.config.autoScaling.scaleUpThreshold && instances.length < this.config.maxInstancesPerType) {
        console.log(`Scaling up ${agentType} agents due to high load (${avgLoad})`);
        await this.scaleUp(agentType);
      } else if (avgLoad < this.config.autoScaling.scaleDownThreshold && instances.length > this.config.minInstancesPerType) {
        console.log(`Scaling down ${agentType} agents due to low load (${avgLoad})`);
        await this.scaleDown(agentType);
      }
    }
  }

  private async scaleUp(agentType: AgentType): Promise<void> {
    console.log(`Scaling up ${agentType} agents`);
    // In a real implementation, this would spawn new agent instances
    // For now, we'll just log the action
  }

  private async scaleDown(agentType: AgentType): Promise<void> {
    console.log(`Scaling down ${agentType} agents`);
    // In a real implementation, this would terminate excess agent instances
    // For now, we'll just log the action
  }

  // Workflow Management
  async registerWorkflow(workflow: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workflowDef: WorkflowDefinition = {
      ...workflow,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.workflows.set(id, workflowDef);
    console.log(`Registered workflow: ${id} (${workflow.name})`);
    return id;
  }

  async executeWorkflow(workflowId: string, input: Record<string, any>): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'pending',
      currentStep: workflow.steps[0]?.id || '',
      steps: [],
      input,
      output: {},
      startedAt: Date.now(),
      cost: 0,
      tokensUsed: 0
    };

    this.executions.set(executionId, execution);
    
    // Start execution
    this.executeWorkflowStep(executionId, workflow.steps[0]);
    
    return executionId;
  }

  private async executeWorkflowStep(executionId: string, step: WorkflowStep): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) return;

    const stepExecution: WorkflowStepExecution = {
      stepId: step.id,
      status: 'running',
      agentInstanceId: '',
      input: {},
      output: {},
      startedAt: Date.now(),
      retryCount: 0,
      cost: 0,
      tokensUsed: 0
    };

    execution.steps.push(stepExecution);
    execution.currentStep = step.id;
    execution.status = 'running';

    try {
      // Get available agent
      const agent = await this.getAvailableAgent(step.agentType, this.config.loadBalancing.strategy);
      if (!agent) {
        throw new Error(`No available ${step.agentType} agent`);
      }

      stepExecution.agentInstanceId = agent.id;
      
      // Update agent load
      await this.updateAgentLoad(agent.id, {
        currentRequests: agent.load.currentRequests + 1
      });

      // Execute the step (this would call the actual agent API)
      const result = await this.callAgent(agent.id, step.action, step.parameters);
      
      stepExecution.output = result;
      stepExecution.status = 'completed';
      stepExecution.completedAt = Date.now();
      
      // Update execution
      execution.output = { ...execution.output, [step.id]: result };
      
      // Check if workflow is complete
      const nextStep = this.getNextStep(execution.workflowId, step.id);
      if (nextStep) {
        this.executeWorkflowStep(executionId, nextStep);
      } else {
        execution.status = 'completed';
        execution.completedAt = Date.now();
      }

    } catch (error) {
      stepExecution.status = 'failed';
      stepExecution.error = error instanceof Error ? error.message : 'Unknown error';
      stepExecution.completedAt = Date.now();
      
      // Handle retries
      if (stepExecution.retryCount < (step.retryCount || 3)) {
        stepExecution.retryCount++;
        stepExecution.status = 'pending';
        setTimeout(() => this.executeWorkflowStep(executionId, step), 1000 * stepExecution.retryCount);
      } else {
        execution.status = 'failed';
        execution.error = stepExecution.error;
        execution.completedAt = Date.now();
      }
    } finally {
      // Update agent load
      if (stepExecution.agentInstanceId) {
        const agent = this.instances.get(stepExecution.agentInstanceId);
        if (agent) {
          await this.updateAgentLoad(agent.id, {
            currentRequests: Math.max(0, agent.load.currentRequests - 1)
          });
        }
      }
    }
  }

  private getNextStep(workflowId: string, currentStepId: string): WorkflowStep | null {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    const currentIndex = workflow.steps.findIndex(s => s.id === currentStepId);
    if (currentIndex === -1 || currentIndex === workflow.steps.length - 1) {
      return null;
    }

    return workflow.steps[currentIndex + 1];
  }

  private async callAgent(agentId: string, action: string, parameters: Record<string, any>): Promise<any> {
    // This would make the actual API call to the agent
    // For now, return mock data
    return {
      success: true,
      data: { action, parameters, agentId },
      timestamp: Date.now()
    };
  }

  // Monitoring and Analytics
  getFleetStatus(): {
    totalInstances: number;
    instancesByType: Record<AgentType, number>;
    healthStatus: Record<string, number>;
    activeWorkflows: number;
    totalCost: number;
  } {
    const instancesByType: Record<AgentType, number> = {} as Record<AgentType, number>;
    const healthStatus: Record<string, number> = {};

    for (const instance of Array.from(this.instances.values())) {
      instancesByType[instance.type] = (instancesByType[instance.type] || 0) + 1;
      healthStatus[instance.status] = (healthStatus[instance.status] || 0) + 1;
    }

    const totalCost = Array.from(this.instances.values()).reduce((sum, i) => sum + i.metrics.costPerRequest, 0);

    return {
      totalInstances: this.instances.size,
      instancesByType,
      healthStatus,
      activeWorkflows: Array.from(this.executions.values()).filter(e => e.status === 'running').length,
      totalCost
    };
  }

  getWorkflowExecution(executionId: string): WorkflowExecution | null {
    return this.executions.get(executionId) || null;
  }

  getAllExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values());
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.autoScalingInterval) {
      clearInterval(this.autoScalingInterval);
    }
  }
}

// Export singleton instance
export const fleetManager = new AgentFleetManager({
  maxInstancesPerType: 10,
  minInstancesPerType: 1,
  autoScaling: {
    enabled: true,
    scaleUpThreshold: 80,
    scaleDownThreshold: 20,
    cooldownPeriod: 60
  },
  healthCheck: {
    interval: 30,
    timeout: 10,
    maxFailures: 3
  },
  loadBalancing: {
    strategy: 'least-loaded',
    stickySessions: false
  }
});

export default fleetManager; 
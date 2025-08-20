import { PlannerAgent } from './agents/planner-agent';
import { TrackerAgent } from './agents/tracker-agent';
import { GuideAgent } from './agents/guide-agent';
import { WorkerAgents } from './agents/worker-agents';
import { queueEnqueueAgentRun } from './tools/queue';
import { dbTaskEvent } from './tools/db';

export interface AgentOrchestratorConfig {
  project_id?: string;
  auto_tracking: boolean;
  auto_escalation: boolean;
  notification_channels: string[];
}

export class AgentOrchestrator {
  private config: AgentOrchestratorConfig;
  private active_agents: Map<string, any> = new Map();

  constructor(config: AgentOrchestratorConfig) {
    this.config = config;
  }

  // Main orchestration method
  async orchestrateWorkflow(input: any): Promise<any> {
    console.log('🚀 Agent Orchestrator: Starting workflow orchestration...');
    
    try {
      // Step 1: Planner Agent creates roadmap
      const plannerResult = await this.executePlannerAgent(input);
      
      // Step 2: Queue initial worker agents
      await this.queueInitialWorkers(plannerResult.tasks);
      
      // Step 3: Start tracking if enabled
      if (this.config.auto_tracking) {
        await this.startAutoTracking();
      }
      
      console.log('✅ Agent Orchestrator: Workflow orchestration completed');
      
      return {
        status: 'success',
        project_id: plannerResult.project_id,
        roadmap: plannerResult,
        next_steps: 'Workers queued and tracking started'
      };
    } catch (error) {
      console.error('❌ Agent Orchestrator failed:', error);
      throw error;
    }
  }

  // Execute Planner Agent
  private async executePlannerAgent(input: any) {
    console.log('📋 Executing Planner Agent...');
    
    const planner = new PlannerAgent({
      project_id: this.config.project_id,
      goal: input.goal,
      constraints: input.constraints || [],
      target_date: input.target_date,
      context: input.context || {}
    });

    const result = await planner.execute();
    
    // Store project_id for future use
    if (result.project_id) {
      this.config.project_id = result.project_id;
    }
    
    // Log planner execution
    await this.logAgentExecution('planner', 'succeeded', result);
    
    return result;
  }

  // Queue initial worker agents
  private async queueInitialWorkers(tasks: any[]) {
    console.log('🔧 Queuing initial worker agents...');
    
    const highPriorityTasks = tasks
      .filter(task => task.priority === 1)
      .slice(0, 3); // Start with top 3 high-priority tasks
    
    for (const task of highPriorityTasks) {
      const agentKey = task.owner_agent_key || 'ops';
      
      await queueEnqueueAgentRun({
        agent_key: agentKey,
        project_id: this.config.project_id || '',
        task_id: task.id,
        input: {
          task_title: task.title,
          details: task.details,
          context: task.context || {}
        }
      });
      
      console.log(`✅ Queued ${agentKey} agent for task: ${task.title}`);
    }
  }

  // Start automatic tracking
  private async startAutoTracking() {
    console.log('📊 Starting automatic tracking...');
    
    // Schedule periodic tracking checks
    setInterval(async () => {
      await this.executeTrackingCycle();
    }, 1000 * 60 * 60); // Check every hour
    
    // Initial tracking check
    await this.executeTrackingCycle();
  }

  // Execute a tracking cycle
  private async executeTrackingCycle() {
    if (!this.config.project_id) return;
    
    console.log('📊 Executing tracking cycle...');
    
    try {
      const tracker = new TrackerAgent({
        project_id: this.config.project_id,
        mode: 'scan',
        now: new Date().toISOString()
      });

      const result = await tracker.execute();
      
      // Log tracking execution
      await this.logAgentExecution('tracker', 'succeeded', result);
      
      // Auto-escalate if enabled and issues found
      if (this.config.auto_escalation && this.hasIssues(result)) {
        await this.autoEscalate(result);
      }
      
      console.log('✅ Tracking cycle completed');
    } catch (error) {
      console.error('❌ Tracking cycle failed:', error);
      await this.logAgentExecution('tracker', 'failed', { error: error.message });
    }
  }

  // Check if there are issues that need escalation
  private hasIssues(trackingResult: any): boolean {
    return (
      trackingResult.overdue_tasks.length > 0 ||
      trackingResult.stalled_tasks.length > 0 ||
      trackingResult.blocked_tasks.length > 0
    );
  }

  // Auto-escalate issues
  private async autoEscalate(trackingResult: any) {
    console.log('🚨 Auto-escalating issues...');
    
    try {
      const guide = new GuideAgent({
        project_id: this.config.project_id || '',
        issues: this.formatIssuesForGuide(trackingResult),
        preferences: {
          tone: 'direct',
          channel: 'in_app'
        }
      });

      const result = await guide.execute();
      
      // Log guide execution
      await this.logAgentExecution('guide', 'succeeded', result);
      
      console.log('✅ Auto-escalation completed');
    } catch (error) {
      console.error('❌ Auto-escalation failed:', error);
      await this.logAgentExecution('guide', 'failed', { error: error.message });
    }
  }

  // Format tracking issues for guide agent
  private formatIssuesForGuide(trackingResult: any): any[] {
    const issues = [];
    
    // Add overdue tasks
    trackingResult.overdue_tasks.forEach((task: any) => {
      issues.push({
        kind: 'overdue',
        task_id: task.task_id,
        context: { days_over: task.days_over }
      });
    });
    
    // Add stalled tasks
    trackingResult.stalled_tasks.forEach((task: any) => {
      issues.push({
        kind: 'stalled',
        task_id: task.task_id,
        context: { last_event_days: task.last_event_days }
      });
    });
    
    // Add blocked tasks
    trackingResult.blocked_tasks.forEach((task: any) => {
      issues.push({
        kind: 'blocked',
        task_id: task.task_id,
        context: { blocker: task.blocker }
      });
    });
    
    return issues;
  }

  // Manual agent execution methods
  async executeAgent(agentKey: string, input: any): Promise<any> {
    console.log(`🤖 Manually executing ${agentKey} agent...`);
    
    try {
      let result;
      
      switch (agentKey) {
        case 'planner':
          result = await this.executePlannerAgent(input);
          break;
        case 'tracker':
          result = await this.executeTrackerAgent(input);
          break;
        case 'guide':
          result = await this.executeGuideAgent(input);
          break;
        case 'marketing':
        case 'finance':
        case 'dev':
        case 'ops':
          result = await this.executeWorkerAgent(agentKey, input);
          break;
        default:
          throw new Error(`Unknown agent: ${agentKey}`);
      }
      
      // Log successful execution
      await this.logAgentExecution(agentKey, 'succeeded', result);
      
      return result;
    } catch (error) {
      console.error(`❌ ${agentKey} agent execution failed:`, error);
      
      // Log failed execution
      await this.logAgentExecution(agentKey, 'failed', { error: error.message });
      
      throw error;
    }
  }

  // Execute Tracker Agent
  private async executeTrackerAgent(input: any) {
    const tracker = new TrackerAgent({
      project_id: this.config.project_id || input.project_id,
      mode: input.mode || 'scan',
      now: input.now || new Date().toISOString()
    });

    return await tracker.execute();
  }

  // Execute Guide Agent
  private async executeGuideAgent(input: any) {
    const guide = new GuideAgent({
      project_id: this.config.project_id || input.project_id,
      issues: input.issues || [],
      preferences: input.preferences || {
        tone: 'direct',
        channel: 'in_app'
      }
    });

    return await guide.execute();
  }

  // Execute Worker Agent
  private async executeWorkerAgent(agentKey: string, input: any) {
    const WorkerAgentClass = WorkerAgents[`${agentKey.charAt(0).toUpperCase() + agentKey.slice(1)}Agent` as keyof typeof WorkerAgents];
    
    if (!WorkerAgentClass) {
      throw new Error(`Worker agent not found: ${agentKey}`);
    }
    
    const worker = new WorkerAgentClass(input);
    return await worker.execute();
  }

  // Get agent status
  async getAgentStatus(): Promise<any> {
    return {
      project_id: this.config.project_id,
      auto_tracking: this.config.auto_tracking,
      auto_escalation: this.config.auto_escalation,
      active_agents: Array.from(this.active_agents.keys()),
      last_tracking_cycle: new Date().toISOString()
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<AgentOrchestratorConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Agent Orchestrator configuration updated');
  }

  // Stop auto-tracking
  stopAutoTracking() {
    this.config.auto_tracking = false;
    console.log('⏹️ Auto-tracking stopped');
  }

  // Start auto-tracking
  startAutoTracking() {
    this.config.auto_tracking = true;
    console.log('▶️ Auto-tracking started');
    this.startAutoTracking();
  }

  // Log agent execution
  private async logAgentExecution(agentKey: string, status: string, result: any) {
    try {
      // Log to database if project_id exists
      if (this.config.project_id) {
        await dbTaskEvent({
          task_id: 'orchestrator', // Use orchestrator as task_id for system events
          type: 'comment',
          payload: {
            agent: agentKey,
            status,
            result: status === 'succeeded' ? 'success' : result.error,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Store in memory for quick access
      this.active_agents.set(agentKey, {
        last_execution: new Date().toISOString(),
        status,
        result: status === 'succeeded' ? 'success' : result.error
      });
    } catch (error) {
      console.error('Failed to log agent execution:', error);
    }
  }

  // Get project summary
  async getProjectSummary(): Promise<any> {
    if (!this.config.project_id) {
      return { error: 'No active project' };
    }
    
    try {
      // Execute tracker to get current status
      const tracker = new TrackerAgent({
        project_id: this.config.project_id,
        mode: 'scan',
        now: new Date().toISOString()
      });

      const trackingResult = await tracker.execute();
      
      return {
        project_id: this.config.project_id,
        status: 'active',
        last_updated: new Date().toISOString(),
        summary: {
          total_tasks: trackingResult.total_tasks || 0,
          overdue_tasks: trackingResult.overdue_tasks.length,
          stalled_tasks: trackingResult.stalled_tasks.length,
          blocked_tasks: trackingResult.blocked_tasks.length,
          completed_tasks: trackingResult.completed_tasks || 0
        },
        recent_activity: trackingResult.recent_activity || []
      };
    } catch (error) {
      console.error('Failed to get project summary:', error);
      return { error: error.message };
    }
  }
}

import { dbGetProjectTasks, dbTaskEvent, dbUpdateTaskStatus } from '../tools/db';
import { queueEnqueueAgentRun } from '../tools/queue';

export interface TrackerRequest {
  project_id: string;
  mode: 'scan' | 'update' | 'escalate';
  now?: string;
}

export interface TrackerResponse {
  overdue_tasks: { task_id: string; days_over: number }[];
  stalled_tasks: { task_id: string; last_event_days: number }[];
  blocked_tasks: { task_id: string; blocker: string }[];
  proposed_events: { task_id: string; type: string; reason: string }[];
  status_updates: { task_id: string; old_status: string; new_status: string }[];
}

export class TrackerAgent {
  private project_id: string;
  private mode: string;
  private now: Date;

  constructor(request: TrackerRequest) {
    this.project_id = request.project_id;
    this.mode = request.mode;
    this.now = request.now ? new Date(request.now) : new Date();
  }

  async execute(): Promise<TrackerResponse> {
    console.log('🤖 Tracker Agent: Starting task monitoring...');
    
    try {
      // Get all project tasks with their events
      const { tasks } = await dbGetProjectTasks(this.project_id);
      
      // Analyze task statuses
      const analysis = this.analyzeTasks(tasks);
      
      // Update task statuses if needed
      const statusUpdates = await this.updateTaskStatuses(tasks, analysis);
      
      // Generate proposed events
      const proposedEvents = this.generateProposedEvents(analysis);
      
      // Escalate issues if needed
      if (this.mode === 'escalate') {
        await this.escalateIssues(analysis);
      }
      
      console.log('✅ Tracker Agent: Task monitoring completed');
      
      return {
        ...analysis,
        status_updates: statusUpdates
      };
    } catch (error) {
      console.error('❌ Tracker Agent failed:', error);
      throw error;
    }
  }

  private analyzeTasks(tasks: any[]) {
    const overdue_tasks: { task_id: string; days_over: number }[] = [];
    const stalled_tasks: { task_id: string; last_event_days: number }[] = [];
    const blocked_tasks: { task_id: string; blocker: string }[] = [];

    tasks.forEach(task => {
      // Check for overdue tasks
      if (task.due_at && task.status !== 'done') {
        const dueDate = new Date(task.due_at);
        const daysOver = Math.ceil((this.now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysOver > 0) {
          overdue_tasks.push({ task_id: task.id, days_over: daysOver });
        }
      }

      // Check for stalled tasks (no activity in 7+ days)
      if (task.events && task.events.length > 0) {
        const lastEvent = new Date(task.events[task.events.length - 1].created_at);
        const daysSinceLastEvent = Math.ceil((this.now.getTime() - lastEvent.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastEvent > 7 && task.status === 'in_progress') {
          stalled_tasks.push({ task_id: task.id, last_event_days: daysSinceLastEvent });
        }
      }

      // Check for blocked tasks
      if (task.status === 'blocked') {
        const blockerEvent = task.events?.find((e: any) => e.type === 'blocked');
        const blocker = blockerEvent?.payload?.reason || 'Unknown blocker';
        blocked_tasks.push({ task_id: task.id, blocker });
      }
    });

    return { overdue_tasks, stalled_tasks, blocked_tasks };
  }

  private async updateTaskStatuses(tasks: any[], analysis: any) {
    const statusUpdates: { task_id: string; old_status: string; new_status: string }[] = [];

    for (const task of tasks) {
      let newStatus = task.status;
      let shouldUpdate = false;

      // Auto-update status based on conditions
      if (task.status === 'not_started' && this.shouldStartTask(task)) {
        newStatus = 'in_progress';
        shouldUpdate = true;
      } else if (task.status === 'in_progress' && this.shouldBlockTask(task)) {
        newStatus = 'blocked';
        shouldUpdate = true;
      } else if (task.status === 'blocked' && this.shouldUnblockTask(task)) {
        newStatus = 'in_progress';
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        await dbUpdateTaskStatus(task.id, newStatus);
        await dbTaskEvent({
          task_id: task.id,
          type: this.getEventTypeForStatusChange(task.status, newStatus),
          payload: { reason: 'auto_status_update' }
        });

        statusUpdates.push({
          task_id: task.id,
          old_status: task.status,
          new_status: newStatus
        });
      }
    }

    return statusUpdates;
  }

  private shouldStartTask(task: any): boolean {
    // Start task if it's high priority and due soon, or if it's been queued for a while
    if (task.priority === 1 && task.due_at) {
      const dueDate = new Date(task.due_at);
      const daysUntilDue = Math.ceil((dueDate.getTime() - this.now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3;
    }
    return false;
  }

  private shouldBlockTask(task: any): boolean {
    // Block task if it's overdue and no progress
    if (task.due_at && task.status === 'in_progress') {
      const dueDate = new Date(task.due_at);
      const daysOver = Math.ceil((this.now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysOver > 2;
    }
    return false;
  }

  private shouldUnblockTask(task: any): boolean {
    // Unblock task if blocker has been resolved
    const blockerEvent = task.events?.find((e: any) => e.type === 'blocked');
    if (blockerEvent) {
      const blockerAge = Math.ceil((this.now.getTime() - new Date(blockerEvent.created_at).getTime()) / (1000 * 60 * 60 * 24));
      // Auto-unblock after 3 days (assumes blocker resolved)
      return blockerAge > 3;
    }
    return false;
  }

  private getEventTypeForStatusChange(oldStatus: string, newStatus: string): string {
    if (newStatus === 'in_progress') return 'started';
    if (newStatus === 'blocked') return 'blocked';
    if (newStatus === 'in_progress' && oldStatus === 'blocked') return 'unblocked';
    return 'comment';
  }

  private generateProposedEvents(analysis: any) {
    const proposedEvents: { task_id: string; type: string; reason: string }[] = [];

    // Propose nudges for overdue tasks
    analysis.overdue_tasks.forEach((task: any) => {
      proposedEvents.push({
        task_id: task.task_id,
        type: 'nudge_needed',
        reason: `overdue_${task.days_over}_days`
      });
    });

    // Propose escalation for stalled tasks
    analysis.stalled_tasks.forEach((task: any) => {
      proposedEvents.push({
        task_id: task.task_id,
        type: 'escalation_needed',
        reason: `stalled_${task.last_event_days}_days`
      });
    });

    // Propose blocker resolution for blocked tasks
    analysis.blocked_tasks.forEach((task: any) => {
      proposedEvents.push({
        task_id: task.task_id,
        type: 'blocker_resolution_needed',
        reason: `blocked_by_${task.blocker}`
      });
    });

    return proposedEvents;
  }

  private async escalateIssues(analysis: any) {
    // Queue Guide Agent for complex issues
    if (analysis.overdue_tasks.length > 0 || analysis.stalled_tasks.length > 0) {
      await queueEnqueueAgentRun({
        agent_key: 'guide',
        project_id: this.project_id,
        input: {
          issues: [
            ...analysis.overdue_tasks.map((t: any) => ({
              kind: 'overdue',
              task_id: t.task_id,
              context: { days_over: t.days_over }
            })),
            ...analysis.stalled_tasks.map((t: any) => ({
              kind: 'stalled',
              task_id: t.task_id,
              context: { last_event_days: t.last_event_days }
            }))
          ],
          preferences: { tone: 'direct', channel: 'in_app' }
        }
      });
    }

    // Queue Worker Agents for blocked tasks
    for (const blockedTask of analysis.blocked_tasks) {
      await queueEnqueueAgentRun({
        agent_key: 'ops', // Ops agent handles blocker resolution
        project_id: this.project_id,
        task_id: blockedTask.task_id,
        input: {
          action: 'resolve_blocker',
          blocker: blockedTask.blocker,
          context: { project_id: this.project_id }
        }
      });
    }
  }

  // Public method for manual task status updates
  async updateTaskStatus(task_id: string, new_status: string, reason?: string) {
    const oldStatus = await this.getCurrentTaskStatus(task_id);
    
    await dbUpdateTaskStatus(task_id, new_status);
    await dbTaskEvent({
      task_id,
      type: this.getEventTypeForStatusChange(oldStatus, new_status),
      payload: { reason: reason || 'manual_update' }
    });

    return { ok: true, old_status: oldStatus, new_status: new_status };
  }

  private async getCurrentTaskStatus(task_id: string): Promise<string> {
    const { tasks } = await dbGetProjectTasks(this.project_id);
    const task = tasks.find((t: any) => t.id === task_id);
    return task?.status || 'unknown';
  }
}

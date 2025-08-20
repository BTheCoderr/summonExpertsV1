import { dbTaskEvent, dbUpdateTaskStatus } from '../tools/db';
import { queueEnqueueAgentRun } from '../tools/queue';
import { slackPostMessage, sendEmail } from '../tools/integrations';

export interface GuideRequest {
  project_id: string;
  issues: {
    kind: 'overdue' | 'stalled' | 'blocked' | 'kpi_miss';
    task_id: string;
    context: any;
  }[];
  preferences: {
    tone: 'direct' | 'encouraging' | 'urgent';
    channel: 'in_app' | 'email' | 'slack';
  };
}

export interface GuideResponse {
  nudges: {
    task_id: string;
    message: string;
    channel: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  plan_adjustments: {
    task_id: string;
    action: 'split' | 'extend' | 'reprioritize' | 'reassign';
    new_tasks?: any[];
    new_due_date?: string;
    new_priority?: number;
    new_owner?: string;
  }[];
  insights: {
    type: 'warning' | 'opportunity' | 'trend';
    message: string;
    recommendation: string;
  }[];
}

export class GuideAgent {
  private project_id: string;
  private issues: any[];
  private preferences: any;

  constructor(request: GuideRequest) {
    this.project_id = request.project_id;
    this.issues = request.issues;
    this.preferences = request.preferences;
  }

  async execute(): Promise<GuideResponse> {
    console.log('🤖 Guide Agent: Starting coaching session...');
    
    try {
      // Analyze issues and generate insights
      const insights = this.generateInsights();
      
      // Generate personalized nudges
      const nudges = await this.generateNudges();
      
      // Propose plan adjustments
      const planAdjustments = this.generatePlanAdjustments();
      
      // Send nudges through appropriate channels
      await this.deliverNudges(nudges);
      
      // Log coaching session
      await this.logCoachingSession(nudges, planAdjustments, insights);
      
      console.log('✅ Guide Agent: Coaching session completed');
      
      return { nudges, plan_adjustments: planAdjustments, insights };
    } catch (error) {
      console.error('❌ Guide Agent failed:', error);
      throw error;
    }
  }

  private generateInsights() {
    const insights = [];

    // Analyze patterns across issues
    const overdueCount = this.issues.filter(i => i.kind === 'overdue').length;
    const stalledCount = this.issues.filter(i => i.kind === 'stalled').length;
    const blockedCount = this.issues.filter(i => i.kind === 'blocked').length;

    if (overdueCount > 2) {
      insights.push({
        type: 'warning',
        message: 'Multiple overdue tasks detected',
        recommendation: 'Consider extending project timeline or reducing scope'
      });
    }

    if (stalledCount > 1) {
      insights.push({
        type: 'trend',
        message: 'Tasks are getting stalled frequently',
        recommendation: 'Review task complexity and resource allocation'
      });
    }

    if (blockedCount > 0) {
      insights.push({
        type: 'opportunity',
        message: 'Blockers identified',
        recommendation: 'Address dependencies early to prevent cascading delays'
      });
    }

    // Add motivational insights
    if (this.issues.length === 0) {
      insights.push({
        type: 'opportunity',
        message: 'Great progress! All tasks are on track',
        recommendation: 'Consider accelerating high-impact tasks'
      });
    }

    return insights;
  }

  private async generateNudges() {
    const nudges = [];

    for (const issue of this.issues) {
      const nudge = await this.createNudgeForIssue(issue);
      if (nudge) {
        nudges.push(nudge);
      }
    }

    return nudges;
  }

  private async createNudgeForIssue(issue: any) {
    const { kind, task_id, context } = issue;
    
    let message = '';
    let priority: 'low' | 'medium' | 'high' = 'medium';

    switch (kind) {
      case 'overdue':
        message = this.generateOverdueNudge(context);
        priority = 'high';
        break;
      case 'stalled':
        message = this.generateStalledNudge(context);
        priority = 'medium';
        break;
      case 'blocked':
        message = this.generateBlockedNudge(context);
        priority = 'high';
        break;
      case 'kpi_miss':
        message = this.generateKPINudge(context);
        priority = 'high';
        break;
    }

    if (message) {
      return {
        task_id,
        message,
        channel: this.preferences.channel,
        priority
      };
    }

    return null;
  }

  private generateOverdueNudge(context: any) {
    const { days_over } = context;
    const tone = this.preferences.tone;
    
    const messages = {
      direct: `🚨 Task is ${days_over} days overdue. Immediate action required.`,
      encouraging: `📅 This task has been waiting ${days_over} days. Let's get it done!`,
      urgent: `⏰ CRITICAL: Task overdue by ${days_over} days. Drop everything and focus here.`
    };

    return messages[tone as keyof typeof messages] || messages.direct;
  }

  private generateStalledNudge(context: any) {
    const { last_event_days } = context;
    const tone = this.preferences.tone;
    
    const messages = {
      direct: `📊 Task has been stalled for ${last_event_days} days. Need to restart momentum.`,
      encouraging: `💪 It's been ${last_event_days} days since progress. Time to pick it up again!`,
      urgent: `⚠️ Task stalled for ${last_event_days} days. This is blocking progress.`
    };

    return messages[tone as keyof typeof messages] || messages.direct;
  }

  private generateBlockedNudge(context: any) {
    const tone = this.preferences.tone;
    
    const messages = {
      direct: '🔒 Task is blocked. Identify and resolve the blocker immediately.',
      encouraging: '🔓 Let\'s unblock this task together. What\'s holding you back?',
      urgent: '🚫 BLOCKER ALERT: This task cannot proceed. Resolve now!'
    };

    return messages[tone as keyof typeof messages] || messages.direct;
  }

  private generateKPINudge(context: any) {
    const tone = this.preferences.tone;
    
    const messages = {
      direct: '📈 KPI target missed. Review strategy and adjust approach.',
      encouraging: '🎯 We\'re close to the target. Let\'s push a bit harder!',
      urgent: '📊 KPI ALERT: Performance below target. Immediate intervention needed.'
    };

    return messages[tone as keyof typeof messages] || messages.direct;
  }

  private generatePlanAdjustments() {
    const adjustments = [];

    // Analyze if tasks need to be split
    const complexTasks = this.issues.filter(i => i.kind === 'overdue' && i.context.days_over > 5);
    
    for (const task of complexTasks) {
      adjustments.push({
        task_id: task.task_id,
        action: 'split',
        new_tasks: [
          {
            title: `${task.task_id} - Part 1`,
            priority: 1,
            due_in_days: 3
          },
          {
            title: `${task.task_id} - Part 2`,
            priority: 2,
            due_in_days: 7
          }
        ]
      });
    }

    // Suggest deadline extensions for reasonable delays
    const reasonableDelays = this.issues.filter(i => i.kind === 'overdue' && i.context.days_over <= 3);
    
    for (const task of reasonableDelays) {
      const extensionDays = Math.ceil(task.context.days_over * 1.5);
      adjustments.push({
        task_id: task.task_id,
        action: 'extend',
        new_due_date: new Date(Date.now() + extensionDays * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Reprioritize based on urgency
    const highPriorityOverdue = this.issues.filter(i => i.kind === 'overdue' && i.context.days_over > 7);
    
    for (const task of highPriorityOverdue) {
      adjustments.push({
        task_id: task.task_id,
        action: 'reprioritize',
        new_priority: 1
      });
    }

    return adjustments;
  }

  private async deliverNudges(nudges: any[]) {
    for (const nudge of nudges) {
      try {
        switch (nudge.channel) {
          case 'slack':
            await slackPostMessage({
              integration_id: 'default',
              channel: 'general',
              text: nudge.message
            });
            break;
          case 'email':
            await sendEmail({
              to: 'user@example.com', // TODO: Get from user context
              subject: `Task Update: ${nudge.priority.toUpperCase()} Priority`,
              body: nudge.message
            });
            break;
          case 'in_app':
            // Store in database for in-app display
            await dbTaskEvent({
              task_id: nudge.task_id,
              type: 'nudge_sent',
              payload: { message: nudge.message, priority: nudge.priority }
            });
            break;
        }
      } catch (error) {
        console.error(`Failed to deliver nudge for task ${nudge.task_id}:`, error);
      }
    }
  }

  private async logCoachingSession(nudges: any[], planAdjustments: any[], insights: any[]) {
    // Log the coaching session for analytics
    const session = {
      project_id: this.project_id,
      timestamp: new Date().toISOString(),
      nudges_sent: nudges.length,
      adjustments_proposed: planAdjustments.length,
      insights_generated: insights.length,
      issues_addressed: this.issues.length
    };

    // TODO: Save to coaching_sessions table
    console.log('Coaching session logged:', session);
  }

  // Public method for manual coaching requests
  async provideCoaching(task_id: string, issue_type: string, context: any) {
    const issue = {
      kind: issue_type as any,
      task_id,
      context
    };

    const nudge = await this.createNudgeForIssue(issue);
    if (nudge) {
      await this.deliverNudges([nudge]);
    }

    return { nudge };
  }

  // Method for generating motivational content
  generateMotivationalMessage() {
    const messages = [
      "🚀 Every expert was once a beginner. Keep pushing forward!",
      "💡 Progress, not perfection. Small steps lead to big results.",
      "🔥 You've got this! Challenges are just opportunities in disguise.",
      "⭐ Success is built one task at a time. Focus on what's next.",
      "🎯 Goals are dreams with deadlines. Let's make them happen!"
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}

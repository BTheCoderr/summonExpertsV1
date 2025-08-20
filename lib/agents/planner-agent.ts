import { dbUpsertPlan, dbCreateProject, queueEnqueueAgentRun } from '../tools/db';
import { storageSaveDoc } from '../tools/storage';

export interface PlannerRequest {
  project_id?: string;
  goal: string;
  constraints: string[];
  target_date: string;
  context: {
    industry: string;
    geo: string;
    [key: string]: any;
  };
}

export interface PlannerResponse {
  milestones: {
    title: string;
    due_date: string;
    order_index: number;
  }[];
  tasks: {
    title: string;
    details?: string;
    milestone_title?: string;
    owner_agent_key?: string;
    priority: number;
    due_in_days: number;
  }[];
  kpi: {
    [key: string]: any;
  };
}

export class PlannerAgent {
  private project_id: string;
  private goal: string;
  private constraints: string[];
  private target_date: string;
  private context: any;

  constructor(request: PlannerRequest) {
    this.goal = request.goal;
    this.constraints = request.constraints;
    this.target_date = request.target_date;
    this.context = request.context;
    this.project_id = request.project_id || '';
  }

  async execute(): Promise<PlannerResponse> {
    console.log('🤖 Planner Agent: Starting roadmap creation...');
    
    try {
      // Create project if not exists
      if (!this.project_id) {
        const project = await this.createProject();
        this.project_id = project.project_id;
      }

      // Generate strategic plan
      const plan = await this.generateStrategicPlan();
      
      // Save to database
      const { milestone_ids, task_ids } = await dbUpsertPlan({
        project_id: this.project_id,
        milestones: plan.milestones,
        tasks: plan.tasks
      });

      // Save plan document
      await storageSaveDoc({
        project_id: this.project_id,
        filename: 'strategic-plan.md',
        content_md: this.generatePlanDocument(plan)
      });

      // Queue initial worker agents
      await this.queueInitialWorkers(plan.tasks);

      console.log('✅ Planner Agent: Roadmap created successfully');
      
      return plan;
    } catch (error) {
      console.error('❌ Planner Agent failed:', error);
      throw error;
    }
  }

  private async createProject() {
    // TODO: Get org_id from user context
    const org_id = 'default-org';
    
    return await dbCreateProject({
      org_id,
      title: this.goal,
      description: `Strategic plan for: ${this.goal}`,
      created_by: 'planner-agent'
    });
  }

  private async generateStrategicPlan(): Promise<PlannerResponse> {
    // AI-powered strategic planning logic
    const totalDays = this.calculateDaysUntilTarget();
    
    // Generate milestones based on goal complexity
    const milestones = this.generateMilestones(totalDays);
    
    // Generate tasks for each milestone
    const tasks = this.generateTasks(milestones, totalDays);
    
    // Generate KPIs
    const kpi = this.generateKPIs();

    return { milestones, tasks, kpi };
  }

  private calculateDaysUntilTarget(): number {
    const target = new Date(this.target_date);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateMilestones(totalDays: number) {
    const milestones = [];
    const milestoneCount = Math.min(Math.ceil(totalDays / 30), 4); // Max 4 milestones
    
    for (let i = 0; i < milestoneCount; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(totalDays * (i + 1) / milestoneCount));
      
      milestones.push({
        title: this.getMilestoneTitle(i, milestoneCount),
        due_date: dueDate.toISOString().split('T')[0],
        order_index: i + 1
      });
    }
    
    return milestones;
  }

  private getMilestoneTitle(index: number, total: number): string {
    const titles = [
      'Foundation & Research',
      'Strategy & Planning', 
      'Execution & Launch',
      'Optimization & Scale'
    ];
    
    return titles[index] || `Milestone ${index + 1}`;
  }

  private generateTasks(milestones: any[], totalDays: number) {
    const tasks = [];
    
    milestones.forEach((milestone, index) => {
      const milestoneTasks = this.getMilestoneTasks(milestone.title, index, totalDays);
      tasks.push(...milestoneTasks);
    });
    
    return tasks;
  }

  private getMilestoneTasks(milestoneTitle: string, milestoneIndex: number, totalDays: number): any[] {
    const taskTemplates = {
      'Foundation & Research': [
        { title: 'Market research and competitive analysis', priority: 1, due_in_days: 7 },
        { title: 'Define target audience and ICP', priority: 1, due_in_days: 10 },
        { title: 'Research legal and compliance requirements', priority: 2, due_in_days: 14 }
      ],
      'Strategy & Planning': [
        { title: 'Develop business model and pricing strategy', priority: 1, due_in_days: 21 },
        { title: 'Create marketing and sales strategy', priority: 1, due_in_days: 25 },
        { title: 'Plan resource allocation and budget', priority: 2, due_in_days: 28 }
      ],
      'Execution & Launch': [
        { title: 'Build MVP or core product/service', priority: 1, due_in_days: 35 },
        { title: 'Launch marketing campaigns', priority: 1, due_in_days: 40 },
        { title: 'Begin customer acquisition', priority: 1, due_in_days: 45 }
      ],
      'Optimization & Scale': [
        { title: 'Analyze performance metrics', priority: 2, due_in_days: 50 },
        { title: 'Optimize based on feedback', priority: 2, due_in_days: 55 },
        { title: 'Plan scaling strategy', priority: 1, due_in_days: 60 }
      ]
    };

    const tasks = taskTemplates[milestoneTitle as keyof typeof taskTemplates] || [];
    
    return tasks.map(task => ({
      ...task,
      milestone_title: milestoneTitle,
      owner_agent_key: this.determineOwnerAgent(task.title),
      due_in_days: task.due_in_days + (milestoneIndex * 15) // Stagger across milestones
    }));
  }

  private determineOwnerAgent(taskTitle: string): string {
    const title = taskTitle.toLowerCase();
    
    if (title.includes('market') || title.includes('marketing') || title.includes('sales')) {
      return 'marketing';
    } else if (title.includes('budget') || title.includes('finance') || title.includes('cost')) {
      return 'finance';
    } else if (title.includes('build') || title.includes('product') || title.includes('mvp')) {
      return 'dev';
    } else if (title.includes('research') || title.includes('legal') || title.includes('compliance')) {
      return 'ops';
    }
    
    return 'ops'; // Default to ops
  }

  private generateKPIs() {
    return {
      target_new_customers: this.estimateCustomerTarget(),
      period_days: this.calculateDaysUntilTarget(),
      revenue_target: this.estimateRevenueTarget(),
      conversion_rate_target: 0.05, // 5% conversion rate
      customer_acquisition_cost_target: 50 // $50 CAC
    };
  }

  private estimateCustomerTarget(): number {
    // Simple estimation based on industry and time
    const industryMultipliers = {
      'cleaning': 20,
      'tech': 100,
      'food': 50,
      'retail': 75
    };
    
    const multiplier = industryMultipliers[this.context.industry as keyof typeof industryMultipliers] || 50;
    const daysMultiplier = this.calculateDaysUntilTarget() / 90; // Normalize to 90 days
    
    return Math.round(multiplier * daysMultiplier);
  }

  private estimateRevenueTarget(): number {
    const customerTarget = this.estimateCustomerTarget();
    const avgOrderValue = this.getAverageOrderValue();
    return customerTarget * avgOrderValue;
  }

  private getAverageOrderValue(): number {
    const industryValues = {
      'cleaning': 150,
      'tech': 500,
      'food': 25,
      'retail': 100
    };
    
    return industryValues[this.context.industry as keyof typeof industryValues] || 100;
  }

  private async queueInitialWorkers(tasks: any[]) {
    // Queue high-priority tasks for immediate execution
    const highPriorityTasks = tasks.filter(task => task.priority === 1).slice(0, 3);
    
    for (const task of highPriorityTasks) {
      await queueEnqueueAgentRun({
        agent_key: task.owner_agent_key || 'ops',
        project_id: this.project_id,
        task_id: task.id,
        input: {
          task_title: task.title,
          details: task.details,
          context: this.context
        }
      });
    }
  }

  private generatePlanDocument(plan: PlannerResponse): string {
    return `# Strategic Plan: ${this.goal}

## Context
- **Industry**: ${this.context.industry}
- **Location**: ${this.context.geo}
- **Target Date**: ${this.target_date}
- **Constraints**: ${this.constraints.join(', ')}

## Milestones
${plan.milestones.map(m => `- **${m.title}** (Due: ${m.due_date})`).join('\n')}

## Key Tasks
${plan.tasks.map(t => `- **${t.title}** (Priority: ${t.priority}, Due: ${t.due_in_days} days, Owner: ${t.owner_agent_key})`).join('\n')}

## KPIs
${Object.entries(plan.kpi).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

---
*Generated by Summon Experts Planner Agent*
`;
  }
}

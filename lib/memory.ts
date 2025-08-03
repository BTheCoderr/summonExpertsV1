// Memory Management System for AI Agents
import { MemoryContext, AgentMetrics, UserAnalytics } from './agent-types';

class MemoryManager {
  private shortTermMemory: Map<string, MemoryContext> = new Map();
  private longTermMemory: Map<string, any> = new Map();
  private agentMetrics: Map<string, AgentMetrics> = new Map();
  private userAnalytics: Map<string, UserAnalytics> = new Map();

  // Short-term memory operations (session-based)
  async getSessionContext(sessionId: string): Promise<MemoryContext | null> {
    return this.shortTermMemory.get(sessionId) || null;
  }

  async setSessionContext(sessionId: string, context: Partial<MemoryContext>): Promise<void> {
    const existing = this.shortTermMemory.get(sessionId);
    const updated: MemoryContext = {
      sessionId,
      userId: context.userId || existing?.userId || 'anonymous',
      shortTerm: {
        ...existing?.shortTerm,
        ...context.shortTerm,
        contextData: {
          ...(existing?.shortTerm.contextData || {}),
          ...(context.shortTerm?.contextData || {})
        },
        recentCommands: [
          ...(existing?.shortTerm.recentCommands || []),
          ...(context.shortTerm?.recentCommands || [])
        ].slice(-10) // Keep last 10 commands
      },
      longTerm: {
        userPreferences: {
          ...(existing?.longTerm.userPreferences || {}),
          ...(context.longTerm?.userPreferences || {})
        },
        frequentlyUsedCommands: [
          ...(existing?.longTerm.frequentlyUsedCommands || []),
          ...(context.longTerm?.frequentlyUsedCommands || [])
        ],
        performanceMetrics: {
          ...(existing?.longTerm.performanceMetrics || {}),
          ...(context.longTerm?.performanceMetrics || {})
        }
      }
    };
    this.shortTermMemory.set(sessionId, updated);
  }

  async updateCurrentTask(sessionId: string, task: string): Promise<void> {
    const context = await this.getSessionContext(sessionId);
    if (context) {
      context.shortTerm.currentTask = task;
      this.shortTermMemory.set(sessionId, context);
    }
  }

  async addCommandToHistory(sessionId: string, command: string): Promise<void> {
    const context = await this.getSessionContext(sessionId);
    if (context) {
      context.shortTerm.recentCommands.push(command);
      if (context.shortTerm.recentCommands.length > 10) {
        context.shortTerm.recentCommands = context.shortTerm.recentCommands.slice(-10);
      }
      this.shortTermMemory.set(sessionId, context);
    }
  }

  // Long-term memory operations (persistent)
  async getLongTermMemory(userId: string, key: string): Promise<any> {
    const userMemory = this.longTermMemory.get(userId) || {};
    return userMemory[key];
  }

  async setLongTermMemory(userId: string, key: string, value: any): Promise<void> {
    const userMemory = this.longTermMemory.get(userId) || {};
    userMemory[key] = value;
    this.longTermMemory.set(userId, userMemory);
  }

  async getUserPreferences(userId: string): Promise<Record<string, any>> {
    return await this.getLongTermMemory(userId, 'preferences') || {};
  }

  async setUserPreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    await this.setLongTermMemory(userId, 'preferences', preferences);
  }

  // Analytics and metrics
  async recordAgentMetrics(agentId: string, metrics: Partial<AgentMetrics>): Promise<void> {
    const existing = this.agentMetrics.get(agentId);
    const updated: AgentMetrics = {
      agentId,
      requestsProcessed: (existing?.requestsProcessed || 0) + 1,
      averageResponseTime: this.calculateAverageResponseTime(existing, metrics.executionTime),
      successRate: this.calculateSuccessRate(existing, metrics.success),
      errorRate: this.calculateErrorRate(existing, metrics.success),
      costPerRequest: metrics.costPerRequest || existing?.costPerRequest || 0,
      lastUpdated: new Date().toISOString()
    };
    this.agentMetrics.set(agentId, updated);
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    return this.userAnalytics.get(userId) || null;
  }

  async updateUserAnalytics(userId: string, update: Partial<UserAnalytics>): Promise<void> {
    const existing = this.userAnalytics.get(userId);
    const updated: UserAnalytics = {
      userId,
      totalSessions: (existing?.totalSessions || 0) + (update.totalSessions || 0),
      commandsUsed: { ...existing?.commandsUsed, ...update.commandsUsed },
      averageSessionDuration: update.averageSessionDuration || existing?.averageSessionDuration || 0,
      mostUsedFeatures: update.mostUsedFeatures || existing?.mostUsedFeatures || [],
      satisfactionScore: update.satisfactionScore || existing?.satisfactionScore
    };
    this.userAnalytics.set(userId, updated);
  }

  // Memory cleanup
  async cleanupSession(sessionId: string): Promise<void> {
    this.shortTermMemory.delete(sessionId);
  }

  async cleanupOldSessions(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    for (const [sessionId, context] of Array.from(this.shortTermMemory.entries())) {
      // Simple cleanup - in production, you'd check actual timestamps
      if (Math.random() < 0.1) { // 10% chance to cleanup old sessions
        this.shortTermMemory.delete(sessionId);
      }
    }
  }

  // Utility methods
  private calculateAverageResponseTime(existing: AgentMetrics | undefined, newTime: number | undefined): number {
    if (!newTime) return existing?.averageResponseTime || 0;
    if (!existing) return newTime;
    return (existing.averageResponseTime + newTime) / 2;
  }

  private calculateSuccessRate(existing: AgentMetrics | undefined, success: boolean | undefined): number {
    if (success === undefined) return existing?.successRate || 0;
    if (!existing) return success ? 100 : 0;
    const totalRequests = existing.requestsProcessed;
    const successfulRequests = Math.round((existing.successRate / 100) * totalRequests);
    return success ? ((successfulRequests + 1) / (totalRequests + 1)) * 100 : (successfulRequests / (totalRequests + 1)) * 100;
  }

  private calculateErrorRate(existing: AgentMetrics | undefined, success: boolean | undefined): number {
    const successRate = this.calculateSuccessRate(existing, success);
    return 100 - successRate;
  }

  // Get memory statistics
  async getMemoryStats(): Promise<{
    shortTermSessions: number;
    longTermUsers: number;
    totalAgentMetrics: number;
    totalUserAnalytics: number;
  }> {
    return {
      shortTermSessions: this.shortTermMemory.size,
      longTermUsers: this.longTermMemory.size,
      totalAgentMetrics: this.agentMetrics.size,
      totalUserAnalytics: this.userAnalytics.size
    };
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();

// Export for direct use
export default memoryManager; 
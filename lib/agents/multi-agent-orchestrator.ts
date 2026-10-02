/**
 * Multi-Agent Orchestrator - Your own implementation
 * Learning from AutoGen patterns but built for your platform
 */

export interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
  process(message: string, context?: any): Promise<AgentResponse>
}

export interface AgentResponse {
  content: string
  metadata?: Record<string, any>
  shouldTerminate?: boolean
  nextAgent?: string
}

export interface Message {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  agentId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ConversationSession {
  id: string
  agents: Agent[]
  messages: Message[]
  currentTurn: number
  maxTurns: number
  status: 'active' | 'completed' | 'terminated'
  createdAt: Date
  updatedAt: Date
}

export interface StreamEvent {
  type: 'agent_response' | 'conversation_complete' | 'error'
  source?: string
  content?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface TerminationCondition {
  shouldTerminate(session: ConversationSession, message: Message): boolean
}

export interface OrchestrationStrategy {
  selectNextAgent(session: ConversationSession, message: Message): Promise<Agent | null>
}

// Termination Conditions
export class TextTerminationCondition implements TerminationCondition {
  constructor(private triggerWords: string[]) {}
  
  shouldTerminate(session: ConversationSession, message: Message): boolean {
    return this.triggerWords.some(word => 
      message.content.toLowerCase().includes(word.toLowerCase())
    )
  }
}

export class TurnLimitCondition implements TerminationCondition {
  constructor(private maxTurns: number) {}
  
  shouldTerminate(session: ConversationSession, message: Message): boolean {
    return session.currentTurn >= this.maxTurns
  }
}

export class CompositeTerminationCondition implements TerminationCondition {
  constructor(private conditions: TerminationCondition[]) {}
  
  shouldTerminate(session: ConversationSession, message: Message): boolean {
    return this.conditions.some(condition => 
      condition.shouldTerminate(session, message)
    )
  }
}

// Orchestration Strategies
export class RoundRobinStrategy implements OrchestrationStrategy {
  async selectNextAgent(session: ConversationSession, message: Message): Promise<Agent | null> {
    if (session.agents.length === 0) return null
    
    const nextIndex = session.currentTurn % session.agents.length
    return session.agents[nextIndex]
  }
}

export class SelectorStrategy implements OrchestrationStrategy {
  constructor(private coordinator: Agent) {}
  
  async selectNextAgent(session: ConversationSession, message: Message): Promise<Agent | null> {
    // Use coordinator to select the best agent
    const response = await this.coordinator.process(
      `Select the best agent for this task: ${message.content}. Available agents: ${session.agents.map(a => a.name).join(', ')}`,
      { availableAgents: session.agents, userMessage: message }
    )
    
    // Parse coordinator's response to determine which agent to use
    const selectedAgentName = this.parseAgentSelection(response.content)
    
    const selectedAgent = session.agents.find(agent => agent.name === selectedAgentName)
    
    return selectedAgent || null
  }
  
  private parseAgentSelection(content: string): string {
    // Remove markdown formatting and normalize
    const normalizedContent = content.replace(/\*\*/g, '').toLowerCase()
    
    // Check for agent names in the normalized content
    for (const agent of ['planner', 'executor', 'writer']) {
      if (normalizedContent.includes(agent)) {
        return agent.charAt(0).toUpperCase() + agent.slice(1) // Capitalize first letter
      }
    }
    
    // Fallback: check original content
    for (const agent of ['planner', 'executor', 'writer']) {
      if (content.toLowerCase().includes(agent)) {
        return agent.charAt(0).toUpperCase() + agent.slice(1) // Capitalize first letter
      }
    }
    
    // Final fallback: check for capitalized versions
    for (const agent of ['Planner', 'Executor', 'Writer']) {
      if (content.includes(agent)) {
        return agent
      }
    }
    
    console.log('Could not parse agent selection from:', content)
    return 'Planner' // fallback - return capitalized version
  }
}

// Main Orchestrator
export class MultiAgentOrchestrator {
  private sessions = new Map<string, ConversationSession>()
  private terminationConditions: TerminationCondition[]
  
  constructor(
    private strategy: OrchestrationStrategy,
    terminationConditions: TerminationCondition[] = []
  ) {
    this.terminationConditions = [
      new TurnLimitCondition(10), // Default max turns
      ...terminationConditions
    ]
  }
  
  async createSession(agents: Agent[], maxTurns: number = 10): Promise<string> {
    const sessionId = this.generateSessionId()
    
    const session: ConversationSession = {
      id: sessionId,
      agents,
      messages: [],
      currentTurn: 0,
      maxTurns,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.sessions.set(sessionId, session)
    return sessionId
  }
  
  async processMessage(sessionId: string, userMessage: string): Promise<AsyncGenerator<StreamEvent>> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }
    
    // Add user message
    const message: Message = {
      id: this.generateMessageId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    
    session.messages.push(message)
    session.updatedAt = new Date()
    
    // Process with agents
    return this.processWithAgents(session, message)
  }
  
  private async *processWithAgents(session: ConversationSession, userMessage: Message): AsyncGenerator<StreamEvent> {
    let currentMessage = userMessage
    
    while (session.status === 'active') {
      // Select next agent
      const nextAgent = await this.strategy.selectNextAgent(session, currentMessage)
      if (!nextAgent) {
        yield {
          type: 'error',
          content: 'No agent available',
          timestamp: new Date().toISOString()
        }
        break
      }
      
      // Process with agent
      try {
        const response = await nextAgent.process(currentMessage.content, {
          session,
          previousMessages: session.messages,
          turn: session.currentTurn
        })
        
        // Create agent message
        const agentMessage: Message = {
          id: this.generateMessageId(),
          role: 'agent',
          content: response.content,
          agentId: nextAgent.id,
          timestamp: new Date(),
          metadata: response.metadata
        }
        
        session.messages.push(agentMessage)
        session.currentTurn++
        session.updatedAt = new Date()
        
        // Yield response
        yield {
          type: 'agent_response',
          source: nextAgent.name,
          content: response.content,
          metadata: response.metadata,
          timestamp: agentMessage.timestamp.toISOString()
        }
        
        // Check termination conditions
        if (this.shouldTerminate(session, agentMessage)) {
          session.status = 'terminated'
          yield {
            type: 'conversation_complete',
            content: 'Conversation completed',
            timestamp: new Date().toISOString()
          }
          break
        }
        
        // Check if agent wants to terminate
        if (response.shouldTerminate) {
          session.status = 'completed'
          yield {
            type: 'conversation_complete',
            content: 'Agent requested termination',
            timestamp: new Date().toISOString()
          }
          break
        }
        
        // Continue with next turn
        currentMessage = agentMessage
        
      } catch (error) {
        yield {
          type: 'error',
          content: `Agent ${nextAgent.name} failed: ${error}`,
          timestamp: new Date().toISOString()
        }
        break
      }
    }
  }
  
  private shouldTerminate(session: ConversationSession, message: Message): boolean {
    return this.terminationConditions.some(condition => 
      condition.shouldTerminate(session, message)
    )
  }
  
  getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId)
  }
  
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 🚀 Enhanced Agent System - Summon Experts
// Based on AutoGen patterns but enhanced for our platform
// Features: State management, team collaboration, tool integration, streaming

import { toolExecutor } from '../tool-executor'
import { TOOL_REGISTRY } from '../tool-registry'

// ============================================================================
// CORE TYPES & INTERFACES
// ============================================================================

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  source: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AgentState {
  id: string
  name: string
  systemMessage: string
  messages: AgentMessage[]
  context: Record<string, any>
  lastUpdated: Date
}

export interface TeamState {
  id: string
  name: string
  agents: AgentState[]
  messages: AgentMessage[]
  terminationCondition: TerminationCondition
  lastUpdated: Date
}

export interface TerminationCondition {
  type: 'max_messages' | 'text_mention' | 'custom'
  config: any
  shouldTerminate: (messages: AgentMessage[], agents: AgentState[]) => boolean
}

export interface AgentResponse {
  success: boolean
  message: AgentMessage
  error?: string
  metadata?: Record<string, any>
}

export interface ToolCall {
  toolName: string
  arguments: Record<string, any>
  result?: any
}

// ============================================================================
// BASE AGENT CLASS
// ============================================================================

export abstract class BaseAgent {
  protected id: string
  protected name: string
  protected systemMessage: string
  protected messages: AgentMessage[] = []
  protected context: Record<string, any> = {}
  protected tools: string[] = []

  constructor(
    name: string,
    systemMessage: string,
    tools: string[] = []
  ) {
    this.id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.name = name
    this.systemMessage = systemMessage
    this.tools = tools
  }

  // Core agent methods
  abstract processMessage(message: AgentMessage): Promise<AgentResponse>
  
  async addMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): Promise<void> {
    const newMessage: AgentMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    this.messages.push(newMessage)
  }

  async executeTool(toolCall: ToolCall): Promise<any> {
    try {
      const result = await toolExecutor.executeTool(toolCall.toolName, toolCall.arguments)
      if (result.success) {
        toolCall.result = result.data
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      throw new Error(`Tool execution failed: ${error.message}`)
    }
  }

  async saveState(): Promise<AgentState> {
    return {
      id: this.id,
      name: this.name,
      systemMessage: this.systemMessage,
      messages: [...this.messages],
      context: { ...this.context },
      lastUpdated: new Date()
    }
  }

  async loadState(state: AgentState): Promise<void> {
    this.id = state.id
    this.name = state.name
    this.systemMessage = state.systemMessage
    this.messages = [...state.messages]
    this.context = { ...state.context }
  }

  getState(): AgentState {
    return {
      id: this.id,
      name: this.name,
      systemMessage: this.systemMessage,
      messages: [...this.messages],
      context: { ...this.context },
      lastUpdated: new Date()
    }
  }

  // Getters
  getName(): string { return this.name }
  getMessages(): AgentMessage[] { return [...this.messages] }
  getContext(): Record<string, any> { return { ...this.context } }
  getTools(): string[] { return [...this.tools] }
}

// ============================================================================
// ASSISTANT AGENT IMPLEMENTATION
// ============================================================================

export class AssistantAgent extends BaseAgent {
  private modelClient: any // Will be replaced with actual LLM client
  private maxTokens: number
  private temperature: number

  constructor(
    name: string,
    systemMessage: string,
    options: {
      tools?: string[]
      maxTokens?: number
      temperature?: number
      modelClient?: any
    } = {}
  ) {
    super(name, systemMessage, options.tools || [])
    this.modelClient = options.modelClient
    this.maxTokens = options.maxTokens || 1000
    this.temperature = options.temperature || 0.7
  }

  async processMessage(message: AgentMessage): Promise<AgentResponse> {
    try {
      // Add message to history
      await this.addMessage(message)

      // Process with LLM (placeholder for now)
      const response = await this.generateResponse(message)
      
      // Add response to history
      await this.addMessage({
        role: 'assistant',
        content: response.content,
        source: this.name,
        metadata: response.metadata
      })

      return {
        success: true,
        message: {
          id: response.id,
          role: 'assistant',
          content: response.content,
          source: this.name,
          timestamp: new Date(),
          metadata: response.metadata
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: `Error: ${error.message}`,
          source: this.name,
          timestamp: new Date()
        },
        error: error.message
      }
    }
  }

  private async generateResponse(message: AgentMessage): Promise<{ id: string; content: string; metadata?: any }> {
    // TODO: Integrate with actual LLM client
    // For now, return a placeholder response
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Simple response generation based on system message and tools
    let content = `I'm ${this.name}, your ${this.systemMessage.toLowerCase()}. `
    
    if (this.tools.length > 0) {
      content += `I have access to these tools: ${this.tools.join(', ')}. `
    }
    
    content += `I received your message: "${message.content}". How can I help you?`
    
    return {
      id: responseId,
      content,
      metadata: {
        tools: this.tools,
        model: 'placeholder',
        tokens: content.length
      }
    }
  }

  async reflectOnToolUse(toolCall: ToolCall): Promise<string> {
    // Agent reflects on tool usage
    const reflection = `I used the ${toolCall.toolName} tool with arguments: ${JSON.stringify(toolCall.arguments)}. `
    
    if (toolCall.result) {
      reflection += `The result was: ${JSON.stringify(toolCall.result)}. `
    }
    
    reflection += `This tool helped me accomplish my task.`
    
    return reflection
  }
}

// ============================================================================
// USER PROXY AGENT
// ============================================================================

export class UserProxyAgent extends BaseAgent {
  private humanInputHandler?: (message: string) => Promise<string>

  constructor(
    name: string,
    systemMessage: string = "You are a user proxy agent that can interact with humans and other agents.",
    options: {
      tools?: string[]
      humanInputHandler?: (message: string) => Promise<string>
    } = {}
  ) {
    super(name, systemMessage, options.tools || [])
    this.humanInputHandler = options.humanInputHandler
  }

  async processMessage(message: AgentMessage): Promise<AgentResponse> {
    try {
      await this.addMessage(message)

      // If human input is needed, use the handler
      if (this.humanInputHandler && message.role === 'user') {
        const humanResponse = await this.humanInputHandler(message.content)
        
        const responseMessage: AgentMessage = {
          id: `human_${Date.now()}`,
          role: 'assistant',
          content: humanResponse,
          source: 'human',
          timestamp: new Date()
        }

        await this.addMessage(responseMessage)

        return {
          success: true,
          message: responseMessage
        }
      }

      // Default processing
      const response: AgentMessage = {
        id: `proxy_${Date.now()}`,
        role: 'assistant',
        content: `I'm ${this.name}, processing your request: ${message.content}`,
        source: this.name,
        timestamp: new Date()
      }

      await this.addMessage(response)

      return {
        success: true,
        message: response
      }
    } catch (error: any) {
      return {
        success: false,
        message: {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: `Error: ${error.message}`,
          source: this.name,
          timestamp: new Date()
        },
        error: error.message
      }
    }
  }

  async requestHumanInput(prompt: string): Promise<string> {
    if (this.humanInputHandler) {
      return await this.humanInputHandler(prompt)
    }
    throw new Error('No human input handler configured')
  }
}

// ============================================================================
// TERMINATION CONDITIONS
// ============================================================================

export class MaxMessageTermination implements TerminationCondition {
  type = 'max_messages' as const
  config: { maxMessages: number }

  constructor(maxMessages: number) {
    this.config = { maxMessages }
  }

  shouldTerminate(messages: AgentMessage[]): boolean {
    return messages.length >= this.config.maxMessages
  }
}

export class TextMentionTermination implements TerminationCondition {
  type = 'text_mention' as const
  config: { triggerText: string }

  constructor(triggerText: string) {
    this.config = { triggerText }
  }

  shouldTerminate(messages: AgentMessage[]): boolean {
    return messages.some(msg => 
      msg.content.toLowerCase().includes(this.config.triggerText.toLowerCase())
    )
  }
}

export class CustomTerminationCondition implements TerminationCondition {
  type = 'custom' as const
  config: any
  private conditionFn: (messages: AgentMessage[], agents: AgentState[]) => boolean

  constructor(conditionFn: (messages: AgentMessage[], agents: AgentState[]) => boolean, config?: any) {
    this.conditionFn = conditionFn
    this.config = config || {}
  }

  shouldTerminate(messages: AgentMessage[], agents: AgentState[]): boolean {
    return this.conditionFn(messages, agents)
  }
}

// ============================================================================
// TEAM COLLABORATION
// ============================================================================

export abstract class BaseTeam {
  protected id: string
  protected name: string
  protected agents: BaseAgent[]
  protected messages: AgentMessage[] = []
  protected terminationCondition: TerminationCondition
  protected isRunning: boolean = false

  constructor(
    name: string,
    agents: BaseAgent[],
    terminationCondition: TerminationCondition
  ) {
    this.id = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.name = name
    this.agents = agents
    this.terminationCondition = terminationCondition
  }

  abstract run(task: string): Promise<AgentMessage[]>
  abstract runStream(task: string): AsyncGenerator<AgentMessage | { type: 'termination'; reason: string }>

  protected async addMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): Promise<void> {
    const newMessage: AgentMessage = {
      ...message,
      id: `team_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    this.messages.push(newMessage)
  }

  protected shouldTerminate(): boolean {
    return this.terminationCondition.shouldTerminate(this.messages, this.agents.map(a => a.getState()))
  }

  async saveState(): Promise<TeamState> {
    const agentStates = await Promise.all(this.agents.map(agent => agent.saveState()))
    
    return {
      id: this.id,
      name: this.name,
      agents: agentStates,
      messages: [...this.messages],
      terminationCondition: this.terminationCondition,
      lastUpdated: new Date()
    }
  }

  async loadState(state: TeamState): Promise<void> {
    this.id = state.id
    this.name = state.name
    this.messages = [...state.messages]
    this.terminationCondition = state.terminationCondition

    // Load agent states
    for (let i = 0; i < this.agents.length && i < state.agents.length; i++) {
      await this.agents[i].loadState(state.agents[i])
    }
  }

  async reset(): Promise<void> {
    this.messages = []
    this.isRunning = false
    
    for (const agent of this.agents) {
      // Reset agent state if it has a reset method
      if ('reset' in agent && typeof (agent as any).reset === 'function') {
        await (agent as any).reset()
      }
    }
  }

  getState(): TeamState {
    return {
      id: this.id,
      name: this.name,
      agents: this.agents.map(a => a.getState()),
      messages: [...this.messages],
      terminationCondition: this.terminationCondition,
      lastUpdated: new Date()
    }
  }

  // Getters
  getName(): string { return this.name }
  getAgents(): BaseAgent[] { return [...this.agents] }
  getMessages(): AgentMessage[] { return [...this.messages] }
  isTeamRunning(): boolean { return this.isRunning }
}

// ============================================================================
// ROUND ROBIN TEAM
// ============================================================================

export class RoundRobinTeam extends BaseTeam {
  async run(task: string): Promise<AgentMessage[]> {
    this.isRunning = true
    
    try {
      // Add initial task message
      await this.addMessage({
        role: 'user',
        content: task,
        source: 'team'
      })

      let currentAgentIndex = 0
      
      while (!this.shouldTerminate()) {
        const currentAgent = this.agents[currentAgentIndex]
        
        // Get the last message for context
        const lastMessage = this.messages[this.messages.length - 1]
        
        // Process with current agent
        const response = await currentAgent.processMessage(lastMessage)
        
        if (response.success) {
          await this.addMessage(response.message)
        } else {
          // Handle error
          await this.addMessage({
            role: 'assistant',
            content: `Error from ${currentAgent.getName()}: ${response.error}`,
            source: currentAgent.getName()
          })
        }

        // Move to next agent
        currentAgentIndex = (currentAgentIndex + 1) % this.agents.length
      }

      return [...this.messages]
    } finally {
      this.isRunning = false
    }
  }

  async *runStream(task: string): AsyncGenerator<AgentMessage | { type: 'termination'; reason: string }> {
    this.isRunning = true
    
    try {
      // Add initial task message
      await this.addMessage({
        role: 'user',
        content: task,
        source: 'team'
      })

      yield this.messages[this.messages.length - 1]

      let currentAgentIndex = 0
      
      while (!this.shouldTerminate()) {
        const currentAgent = this.agents[currentAgentIndex]
        const lastMessage = this.messages[this.messages.length - 1]
        
        // Process with current agent
        const response = await currentAgent.processMessage(lastMessage)
        
        if (response.success) {
          await this.addMessage(response.message)
          yield response.message
        } else {
          const errorMessage: AgentMessage = {
            id: `error_${Date.now()}`,
            role: 'assistant',
            content: `Error from ${currentAgent.getName()}: ${response.error}`,
            source: currentAgent.getName(),
            timestamp: new Date()
          }
          await this.addMessage(errorMessage)
          yield errorMessage
        }

        currentAgentIndex = (currentAgentIndex + 1) % this.agents.length
      }

      yield { type: 'termination', reason: 'Termination condition met' }
    } finally {
      this.isRunning = false
    }
  }
}

// ============================================================================
// AGENT FACTORY
// ============================================================================

export class AgentFactory {
  static createAssistantAgent(
    name: string,
    systemMessage: string,
    options: {
      tools?: string[]
      maxTokens?: number
      temperature?: number
      modelClient?: any
    } = {}
  ): AssistantAgent {
    return new AssistantAgent(name, systemMessage, options)
  }

  static createUserProxyAgent(
    name: string,
    systemMessage?: string,
    options: {
      tools?: string[]
      humanInputHandler?: (message: string) => Promise<string>
    } = {}
  ): UserProxyAgent {
    return new UserProxyAgent(name, systemMessage, options)
  }

  static createRoundRobinTeam(
    name: string,
    agents: BaseAgent[],
    terminationCondition: TerminationCondition
  ): RoundRobinTeam {
    return new RoundRobinTeam(name, agents, terminationCondition)
  }

  static createMaxMessageTermination(maxMessages: number): MaxMessageTermination {
    return new MaxMessageTermination(maxMessages)
  }

  static createTextMentionTermination(triggerText: string): TextMentionTermination {
    return new TextMentionTermination(triggerText)
  }

  static createCustomTerminationCondition(
    conditionFn: (messages: AgentMessage[], agents: AgentState[]) => boolean,
    config?: any
  ): CustomTerminationCondition {
    return new CustomTerminationCondition(conditionFn, config)
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  BaseAgent,
  AssistantAgent,
  UserProxyAgent,
  BaseTeam,
  RoundRobinTeam,
  AgentFactory,
  MaxMessageTermination,
  TextMentionTermination,
  CustomTerminationCondition
}

export type {
  AgentMessage,
  AgentState,
  TeamState,
  TerminationCondition,
  AgentResponse,
  ToolCall
}

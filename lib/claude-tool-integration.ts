// 🤖 Claude Tool Integration
// This file provides the interface for Claude to use our tools
// When you fine-tune Claude, it will call these endpoints

import { TOOL_REGISTRY, ToolDefinition } from './tool-registry'

export interface ClaudeToolCall {
  name: string
  arguments: Record<string, any>
}

export interface ClaudeToolResult {
  tool_call_id: string
  role: 'tool'
  content: string
}

export class ClaudeToolIntegration {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  /**
   * Get the tool schema for Claude
   * This is what you'll send to Claude when registering tools
   */
  getToolSchema() {
    const tools = Object.values(TOOL_REGISTRY).map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }))

    return { tools }
  }

  /**
   * Execute a tool call from Claude
   */
  async executeToolCall(toolCall: ClaudeToolCall): Promise<any> {
    const tool = TOOL_REGISTRY[toolCall.name]
    if (!tool) {
      throw new Error(`Tool '${toolCall.name}' not found`)
    }

    const response = await fetch(`${this.baseUrl}${tool.url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolCall.arguments),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Execute multiple tool calls in parallel
   */
  async executeToolCalls(toolCalls: ClaudeToolCall[]): Promise<any[]> {
    const promises = toolCalls.map(call => this.executeToolCall(call))
    return Promise.all(promises)
  }

  /**
   * Format tool results for Claude
   */
  formatToolResults(toolCalls: ClaudeToolCall[], results: any[]): ClaudeToolResult[] {
    return toolCalls.map((call, index) => ({
      tool_call_id: `call_${index}`,
      role: 'tool' as const,
      content: JSON.stringify(results[index])
    }))
  }

  /**
   * Get tool examples for Claude
   */
  getToolExamples() {
    const examples: Record<string, any> = {}
    
    Object.entries(TOOL_REGISTRY).forEach(([name, tool]) => {
      examples[name] = tool.examples
    })
    
    return examples
  }

  /**
   * Validate tool call parameters
   */
  validateToolCall(toolCall: ClaudeToolCall): { valid: boolean; errors: string[] } {
    const tool = TOOL_REGISTRY[toolCall.name]
    if (!tool) {
      return { valid: false, errors: [`Tool '${toolCall.name}' not found`] }
    }

    const errors: string[] = []
    
    // Check required parameters
    const missingParams = tool.parameters.required.filter(param => !(param in toolCall.arguments))
    if (missingParams.length > 0) {
      errors.push(`Missing required parameters: ${missingParams.join(', ')}`)
    }

    // Check parameter types
    for (const [paramName, paramValue] of Object.entries(toolCall.arguments)) {
      const paramDef = tool.parameters.properties[paramName]
      if (paramDef) {
        if (paramDef.type === 'string' && typeof paramValue !== 'string') {
          errors.push(`Parameter '${paramName}' must be a string`)
        } else if (paramDef.type === 'number' && typeof paramValue !== 'number') {
          errors.push(`Parameter '${paramName}' must be a number`)
        } else if (paramDef.type === 'array' && !Array.isArray(paramValue)) {
          errors.push(`Parameter '${paramName}' must be an array`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Create default instance
export const claudeToolIntegration = new ClaudeToolIntegration()

// Export for use in other parts of the application
export default claudeToolIntegration

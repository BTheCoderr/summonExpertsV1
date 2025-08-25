// 🛠️ Tool Execution Service
// This service allows the frontend to execute tools via their API endpoints
// Used by agents, workflows, and direct user interactions

import { TOOL_REGISTRY, ToolDefinition } from './tool-registry';

export interface ToolExecutionRequest {
  toolName: string;
  parameters: Record<string, any>;
}

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
}

export class ToolExecutor {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute a tool by name with the given parameters
   */
  async executeTool(toolName: string, parameters: Record<string, any>): Promise<ToolExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Get tool definition
      const tool = TOOL_REGISTRY[toolName];
      if (!tool) {
        throw new Error(`Tool '${toolName}' not found in registry`);
      }

      // Validate required parameters
      const missingParams = tool.parameters.required.filter(param => !(param in parameters));
      if (missingParams.length > 0) {
        throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
      }

      // Execute the tool
      const response = await fetch(`${this.baseUrl}${tool.url}`, {
        method: tool.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data,
        executionTime,
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message,
        executionTime,
      };
    }
  }

  /**
   * Execute multiple tools in sequence
   */
  async executeTools(executions: ToolExecutionRequest[]): Promise<ToolExecutionResult[]> {
    const results: ToolExecutionResult[] = [];
    
    for (const execution of executions) {
      const result = await this.executeTool(execution.toolName, execution.parameters);
      results.push(result);
      
      // Stop on first failure if needed
      if (!result.success) {
        break;
      }
    }
    
    return results;
  }

  /**
   * Execute multiple tools in parallel
   */
  async executeToolsParallel(executions: ToolExecutionRequest[]): Promise<ToolExecutionResult[]> {
    const promises = executions.map(execution => 
      this.executeTool(execution.toolName, execution.parameters)
    );
    
    return Promise.all(promises);
  }

  /**
   * Get tool information
   */
  getToolInfo(toolName: string): ToolDefinition | undefined {
    return TOOL_REGISTRY[toolName];
  }

  /**
   * List all available tools
   */
  listTools(): string[] {
    return Object.keys(TOOL_REGISTRY);
  }

  /**
   * Validate parameters for a tool
   */
  validateParameters(toolName: string, parameters: Record<string, any>): { valid: boolean; errors: string[] } {
    const tool = TOOL_REGISTRY[toolName];
    if (!tool) {
      return { valid: false, errors: [`Tool '${toolName}' not found`] };
    }

    const errors: string[] = [];
    
    // Check required parameters
    const missingParams = tool.parameters.required.filter(param => !(param in parameters));
    if (missingParams.length > 0) {
      errors.push(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    // Check parameter types (basic validation)
    for (const [paramName, paramValue] of Object.entries(parameters)) {
      const paramDef = tool.parameters.properties[paramName];
      if (paramDef) {
        if (paramDef.type === 'string' && typeof paramValue !== 'string') {
          errors.push(`Parameter '${paramName}' must be a string`);
        } else if (paramDef.type === 'number' && typeof paramValue !== 'number') {
          errors.push(`Parameter '${paramName}' must be a number`);
        } else if (paramDef.type === 'array' && !Array.isArray(paramValue)) {
          errors.push(`Parameter '${paramName}' must be an array`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Create a default instance
export const toolExecutor = new ToolExecutor();

// Export for use in other parts of the application
export default toolExecutor;

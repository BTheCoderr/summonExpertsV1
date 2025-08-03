// Execution Agent - Handles API calls and tracks success/failure
import { NextRequest, NextResponse } from 'next/server';
import { AgentResponse } from '@/lib/agent-types';
import memoryManager from '@/lib/memory';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { action, parameters, timestamp } = body;
    
    let result: any;
    
    switch (action) {
      case 'api_call':
        result = await executeApiCall(parameters);
        break;
        
      case 'batch_execution':
        result = await executeBatchOperations(parameters);
        break;
        
      case 'status_check':
        result = await checkExecutionStatus(parameters);
        break;
        
      case 'rollback':
        result = await rollbackOperation(parameters);
        break;
        
      case 'retry_failed':
        result = await retryFailedOperation(parameters);
        break;
        
      default:
        throw new Error(`Unknown execution action: ${action}`);
    }
    
    // Record metrics
    const executionTime = Date.now() - startTime;
    await memoryManager.recordAgentMetrics('execution', {
      executionTime,
      success: result.success !== false
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        agent: 'execution',
        executionTime,
        action,
        confidence: result.confidence || 0.8
      }
    } as AgentResponse);
    
  } catch (error) {
    console.error('Execution agent error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        agent: 'execution',
        executionTime: Date.now() - startTime
      }
    } as AgentResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Execution Agent is running',
    capabilities: [
      'API call execution',
      'Batch operation handling',
      'Status monitoring',
      'Error handling and retry',
      'Rollback operations'
    ],
    actions: [
      'api_call',
      'batch_execution',
      'status_check',
      'rollback',
      'retry_failed'
    ]
  });
}

// Execute a single API call
async function executeApiCall(parameters: any) {
  const { endpoint, method, headers, body, timeout = 30000 } = parameters;
  
  try {
    console.log(`Executing API call to: ${endpoint}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(endpoint, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      executionTime: Date.now()
    };
    
  } catch (error) {
    console.error('API call failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown API error',
      retryable: isRetryableError(error),
      executionTime: Date.now()
    };
  }
}

// Execute batch operations
async function executeBatchOperations(parameters: any) {
  const { operations, parallel = false, maxRetries = 3 } = parameters;
  
  const results = [];
  const errors = [];
  
  if (parallel) {
    // Execute operations in parallel
    const promises = operations.map(async (operation: any, index: number) => {
      try {
        const result = await executeApiCall(operation);
        return { index, result };
      } catch (error) {
        return { index, error };
      }
    });
    
    const batchResults = await Promise.allSettled(promises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push({ index, error: result.reason });
      }
    });
    
  } else {
    // Execute operations sequentially
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      let retries = 0;
      
      while (retries < maxRetries) {
        try {
          const result = await executeApiCall(operation);
          results.push({ index: i, result });
          break;
        } catch (error) {
          retries++;
          if (retries === maxRetries) {
            errors.push({ index: i, error, retries });
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          }
        }
      }
    }
  }
  
  return {
    success: errors.length === 0,
    results,
    errors,
    summary: {
      total: operations.length,
      successful: results.length,
      failed: errors.length,
      successRate: (results.length / operations.length) * 100
    }
  };
}

// Check execution status
async function checkExecutionStatus(parameters: any) {
  const { operationId, endpoint } = parameters;
  
  try {
    const statusEndpoint = endpoint || `/api/status/${operationId}`;
    const response = await fetch(statusEndpoint);
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    
    const status = await response.json();
    
    return {
      success: true,
      operationId,
      status: status.status || 'unknown',
      progress: status.progress || 0,
      estimatedCompletion: status.estimatedCompletion,
      lastUpdated: status.lastUpdated || new Date().toISOString()
    };
    
  } catch (error) {
    return {
      success: false,
      operationId,
      error: error instanceof Error ? error.message : 'Status check failed',
      status: 'unknown'
    };
  }
}

// Rollback operation
async function rollbackOperation(parameters: any) {
  const { operationId, rollbackSteps, originalState } = parameters;
  
  try {
    console.log(`Rolling back operation: ${operationId}`);
    
    const rollbackResults = [];
    
    for (const step of rollbackSteps) {
      try {
        const result = await executeApiCall(step);
        rollbackResults.push({ step: step.name, success: true, result });
      } catch (error) {
        rollbackResults.push({ step: step.name, success: false, error });
      }
    }
    
    const allSuccessful = rollbackResults.every(r => r.success);
    
    return {
      success: allSuccessful,
      operationId,
      rollbackResults,
      originalState,
      completedAt: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      success: false,
      operationId,
      error: error instanceof Error ? error.message : 'Rollback failed',
      rollbackResults: []
    };
  }
}

// Retry failed operation
async function retryFailedOperation(parameters: any) {
  const { operationId, operation, maxRetries = 3, backoffMultiplier = 2 } = parameters;
  
  try {
    console.log(`Retrying failed operation: ${operationId}`);
    
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await executeApiCall(operation);
        
        return {
          success: true,
          operationId,
          result,
          attempts: attempt,
          retrySuccessful: true
        };
        
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = 1000 * Math.pow(backoffMultiplier, attempt - 1);
          console.log(`Retry attempt ${attempt} failed, waiting ${delay}ms before next attempt`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    return {
      success: false,
      operationId,
      error: lastError instanceof Error ? lastError.message : 'All retry attempts failed',
      attempts: maxRetries,
      retrySuccessful: false
    };
    
  } catch (error) {
    return {
      success: false,
      operationId,
      error: error instanceof Error ? error.message : 'Retry operation failed',
      attempts: 0
    };
  }
}

// Helper function to determine if an error is retryable
function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code || error.status || '';
  
  // Network errors are usually retryable
  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return true;
  }
  
  // HTTP 5xx errors are retryable
  if (errorCode >= 500 && errorCode < 600) {
    return true;
  }
  
  // Rate limiting errors are retryable
  if (errorCode === 429 || errorMessage.includes('rate limit')) {
    return true;
  }
  
  // Specific retryable error patterns
  const retryablePatterns = [
    'temporary',
    'unavailable',
    'service unavailable',
    'connection refused',
    'connection reset'
  ];
  
  return retryablePatterns.some(pattern => errorMessage.includes(pattern));
} 
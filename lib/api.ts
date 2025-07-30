/**
 * Shared API utilities for making requests to our backend endpoints
 */

const API_BASE = '/api';

interface ApiResponse<T = any> {
  result?: T;
  error?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * API methods for different endpoints
 */
export const api = {
  // Claude API
  claude: {
    generate: (prompt: string) =>
      apiRequest('/claude', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      }),
  },

  // GPT-4o API
  gpt: {
    generate: (prompt: string) =>
      apiRequest('/gpt', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      }),
  },

  // Notion API
  notion: {
    read: (pageId?: string) =>
      apiRequest('/notion', {
        method: 'POST',
        body: JSON.stringify({ action: 'read', pageId }),
      }),
    
    write: (content: string, pageId?: string) =>
      apiRequest('/notion', {
        method: 'POST',
        body: JSON.stringify({ action: 'write', content, pageId }),
      }),
    
    summarize: (content: string) =>
      apiRequest('/notion', {
        method: 'POST',
        body: JSON.stringify({ action: 'summarize', content }),
      }),
  },
};

export type { ApiResponse }; 
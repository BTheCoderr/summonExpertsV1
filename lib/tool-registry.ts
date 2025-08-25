// 🤖 Summon Experts Tool Registry
// This file defines all available tools and their API endpoints
// Used by Claude and other agent orchestrators

export interface ToolDefinition {
  name: string;
  description: string;
  url: string;
  method: 'POST';
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  examples: {
    input: any;
    output: any;
  }[];
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  // Database Operations
  dbUpsertPlan: {
    name: 'dbUpsertPlan',
    description: 'Create or update project milestones and tasks in the database',
    url: '/api/tools/dbUpsertPlan',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Unique identifier for the project'
        },
        milestones: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              due_date: { type: 'string', format: 'date' },
              order_index: { type: 'number' }
            }
          }
        },
        tasks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              details: { type: 'string' },
              milestone_title: { type: 'string' },
              owner_agent_key: { type: 'string' },
              priority: { type: 'number' },
              due_in_days: { type: 'number' }
            }
          }
        }
      },
      required: ['project_id', 'milestones', 'tasks']
    },
    examples: [
      {
        input: {
          project_id: 'uuid-123',
          milestones: [
            { title: 'Foundation', due_date: '2025-12-01', order_index: 1 }
          ],
          tasks: [
            { title: 'Market Research', priority: 1, due_in_days: 7 }
          ]
        },
        output: {
          milestone_ids: ['uuid-456'],
          task_ids: ['uuid-789']
        }
      }
    ]
  },

  dbTaskEvent: {
    name: 'dbTaskEvent',
    description: 'Log an event for a specific task (started, completed, blocked, etc.)',
    url: '/api/tools/dbTaskEvent',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'Unique identifier for the task'
        },
        type: {
          type: 'string',
          enum: ['created', 'started', 'blocked', 'unblocked', 'completed', 'comment', 'nudge_sent'],
          description: 'Type of event to log'
        },
        payload: {
          type: 'object',
          description: 'Additional data for the event'
        }
      },
      required: ['task_id', 'type']
    },
    examples: [
      {
        input: {
          task_id: 'uuid-789',
          type: 'started',
          payload: { started_by: 'user-123' }
        },
        output: { ok: true }
      }
    ]
  },

  dbGetProjectTasks: {
    name: 'dbGetProjectTasks',
    description: 'Retrieve all tasks for a specific project with their events and milestone info',
    url: '/api/tools/dbGetProjectTasks',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Unique identifier for the project'
        }
      },
      required: ['project_id']
    },
    examples: [
      {
        input: { project_id: 'uuid-123' },
        output: {
          tasks: [
            {
              id: 'uuid-789',
              title: 'Market Research',
              status: 'in_progress',
              milestone: { title: 'Foundation' },
              events: [{ type: 'started', created_at: '2025-11-01T10:00:00Z' }]
            }
          ]
        }
      }
    ]
  },

  dbUpdateTaskStatus: {
    name: 'dbUpdateTaskStatus',
    description: 'Update the status of a specific task',
    url: '/api/tools/dbUpdateTaskStatus',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'Unique identifier for the task'
        },
        status: {
          type: 'string',
          enum: ['not_started', 'in_progress', 'blocked', 'done'],
          description: 'New status for the task'
        }
      },
      required: ['task_id', 'status']
    },
    examples: [
      {
        input: {
          task_id: 'uuid-789',
          status: 'completed'
        },
        output: { ok: true }
      }
    ]
  },

  // Queue Operations
  queueEnqueueAgentRun: {
    name: 'queueEnqueueAgentRun',
    description: 'Add an agent execution job to the queue for background processing',
    url: '/api/tools/queueEnqueueAgentRun',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        agent_key: {
          type: 'string',
          enum: ['planner', 'tracker', 'guide', 'marketing', 'finance', 'dev', 'ops'],
          description: 'Type of agent to execute'
        },
        project_id: {
          type: 'string',
          description: 'Project ID for the agent execution'
        },
        task_id: {
          type: 'string',
          description: 'Optional task ID for the agent execution'
        },
        input: {
          type: 'object',
          description: 'Input data for the agent'
        }
      },
      required: ['agent_key', 'project_id', 'input']
    },
    examples: [
      {
        input: {
          agent_key: 'marketing',
          project_id: 'uuid-123',
          input: { task_title: 'Create social media campaign' }
        },
        output: { run_id: 'job-456' }
      }
    ]
  },

  // Storage Operations
  storageSaveDoc: {
    name: 'storageSaveDoc',
    description: 'Save a document or data to Supabase storage and log the output',
    url: '/api/tools/storageSaveDoc',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID for the document'
        },
        task_id: {
          type: 'string',
          description: 'Optional task ID for the document'
        },
        filename: {
          type: 'string',
          description: 'Name of the file to save'
        },
        content_md: {
          type: 'string',
          description: 'Markdown content to save'
        },
        content_json: {
          type: 'object',
          description: 'JSON content to save'
        }
      },
      required: ['project_id', 'filename']
    },
    examples: [
      {
        input: {
          project_id: 'uuid-123',
          filename: 'strategic-plan.md',
          content_md: '# Strategic Plan\n\n## Goals\n- Launch business in 90 days'
        },
        output: { url: 'https://storage.supabase.co/outputs/strategic-plan.md' }
      }
    ]
  },

  // Integration Operations
  slackPostMessage: {
    name: 'slackPostMessage',
    description: 'Post a message to a Slack channel',
    url: '/api/tools/slackPostMessage',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        integration_id: {
          type: 'string',
          description: 'Slack integration identifier'
        },
        channel: {
          type: 'string',
          description: 'Slack channel to post to'
        },
        text: {
          type: 'string',
          description: 'Message text to post'
        }
      },
      required: ['integration_id', 'channel', 'text']
    },
    examples: [
      {
        input: {
          integration_id: 'slack-123',
          channel: 'general',
          text: '🚀 New project milestone completed!'
        },
        output: { ts: '1234567890.123456' }
      }
    ]
  },

  notionCreatePage: {
    name: 'notionCreatePage',
    description: 'Create a new page in a Notion database',
    url: '/api/tools/notionCreatePage',
    method: 'POST',
    parameters: {
      type: 'object',
      properties: {
        integration_id: {
          type: 'string',
          description: 'Notion integration identifier'
        },
        parent_database_id: {
          type: 'string',
          description: 'Notion database ID to create the page in'
        },
        title: {
          type: 'string',
          description: 'Title for the new page'
        },
        content_md: {
          type: 'string',
          description: 'Markdown content for the page'
        }
      },
      required: ['integration_id', 'parent_database_id', 'title']
    },
    examples: [
      {
        input: {
          integration_id: 'notion-123',
          parent_database_id: 'db-456',
          title: 'Strategic Plan Q4 2025',
          content_md: '# Strategic Plan\n\n## Overview\nBusiness growth strategy...'
        },
        output: { notion_page_url: 'https://notion.so/page-789' }
      }
    ]
  }
};

// Helper function to get tool by name
export function getTool(name: string): ToolDefinition | undefined {
  return TOOL_REGISTRY[name];
}

// Helper function to get all tools
export function getAllTools(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY);
}

// Helper function to get tools by category
export function getToolsByCategory(category: 'database' | 'queue' | 'storage' | 'integration'): ToolDefinition[] {
  const categoryMap = {
    database: ['dbUpsertPlan', 'dbTaskEvent', 'dbGetProjectTasks', 'dbUpdateTaskStatus'],
    queue: ['queueEnqueueAgentRun'],
    storage: ['storageSaveDoc'],
    integration: ['slackPostMessage', 'notionCreatePage']
  };

  return categoryMap[category]
    .map(name => TOOL_REGISTRY[name])
    .filter(Boolean);
}

// Export for use in other parts of the application
export default TOOL_REGISTRY;

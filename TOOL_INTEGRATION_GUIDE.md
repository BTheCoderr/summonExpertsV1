# 🔗 **Tool Integration Guide - Summon Experts Agent System**

This guide explains how all the tools are wired together and how they can be used by Claude, agents, and the frontend.

## 🏗️ **Architecture Overview**

```
Frontend Components → Tool Executor → API Routes → Tool Functions → External Services
       ↓                    ↓            ↓            ↓              ↓
   User Interface    HTTP Client    Next.js API   Database/      Supabase/
                     Validation     Endpoints     Storage/       Redis/APIs
                                                      Queue
```

## 🛠️ **Tool Components**

### **1. Tool Registry (`/lib/tool-registry.ts`)**
- **Purpose**: Central definition of all available tools
- **Contains**: Tool schemas, parameters, examples, and API endpoints
- **Used by**: Claude integration, frontend, validation

### **2. Tool Executor (`/lib/tool-executor.ts`)**
- **Purpose**: Frontend service for executing tools
- **Features**: Parameter validation, error handling, execution timing
- **Used by**: Components, workflows, direct user interactions

### **3. Claude Integration (`/lib/claude-tool-integration.ts`)**
- **Purpose**: Interface for Claude to use tools
- **Features**: Tool schema generation, parameter validation, result formatting
- **Used by**: Claude API, fine-tuned models

### **4. API Routes (`/app/api/tools/[tool]/route.ts`)**
- **Purpose**: HTTP endpoints for each tool
- **Features**: Request parsing, error handling, response formatting
- **Used by**: Frontend, external systems, Claude

## 🔄 **How Tools Work Together**

### **Complete Workflow Example**

```typescript
// 1. User submits business goal
const goal = "Launch my bakery in 60 days"

// 2. Planner Agent uses tools to create roadmap
const plannerResult = await toolExecutor.executeTool('dbUpsertPlan', {
  project_id: 'uuid-123',
  milestones: [
    { title: 'Foundation', due_date: '2025-12-01', order_index: 1 }
  ],
  tasks: [
    { title: 'Market Research', priority: 1, due_in_days: 7 }
  ]
})

// 3. Tracker Agent monitors progress
const trackerResult = await toolExecutor.executeTool('dbTaskEvent', {
  task_id: 'uuid-789',
  type: 'started',
  payload: { started_by: 'planner-agent' }
})

// 4. Worker Agents execute specialized tasks
const marketingResult = await toolExecutor.executeTool('storageSaveDoc', {
  project_id: 'uuid-123',
  filename: 'marketing-strategy.md',
  content_md: '# Marketing Strategy\n\n## Social Media Campaign...'
})

// 5. Guide Agent provides coaching
const guideResult = await toolExecutor.executeTool('slackPostMessage', {
  integration_id: 'slack-123',
  channel: 'general',
  text: '🚀 New milestone completed! Check your dashboard for updates.'
})
```

## 🎯 **Tool Categories & Usage**

### **Database Tools**
```typescript
// Create/update project plans
dbUpsertPlan({
  project_id: 'uuid',
  milestones: [...],
  tasks: [...]
})

// Log task events
dbTaskEvent({
  task_id: 'uuid',
  type: 'started',
  payload: { reason: 'auto_start' }
})

// Get project information
dbGetProjectTasks({
  project_id: 'uuid'
})

// Update task status
dbUpdateTaskStatus({
  task_id: 'uuid',
  status: 'completed'
})
```

### **Queue Tools**
```typescript
// Queue agent execution
queueEnqueueAgentRun({
  agent_key: 'marketing',
  project_id: 'uuid',
  input: { task_title: 'Create campaign' }
})
```

### **Storage Tools**
```typescript
// Save documents
storageSaveDoc({
  project_id: 'uuid',
  filename: 'strategic-plan.md',
  content_md: '# Strategic Plan...'
})
```

### **Integration Tools**
```typescript
// Post to Slack
slackPostMessage({
  integration_id: 'slack-123',
  channel: 'general',
  text: 'Project update available!'
})

// Create Notion page
notionCreatePage({
  integration_id: 'notion-123',
  parent_database_id: 'db-456',
  title: 'Q4 Strategy',
  content_md: '# Q4 Strategy...'
})
```

## 🤖 **Claude Integration**

### **Tool Registration**
When you register tools with Claude, send this schema:

```typescript
import { claudeToolIntegration } from '@/lib/claude-tool-integration'

const toolSchema = claudeToolIntegration.getToolSchema()

// Send to Claude API
const response = await claude.chat.completions.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: [...],
  tools: toolSchema.tools,
  tool_choice: 'auto'
})
```

### **Tool Execution**
When Claude calls tools:

```typescript
// Claude sends tool calls
const toolCalls = [
  {
    name: 'dbUpsertPlan',
    arguments: {
      project_id: 'uuid-123',
      milestones: [...],
      tasks: [...]
    }
  }
]

// Execute the tools
const results = await claudeToolIntegration.executeToolCalls(toolCalls)

// Format results for Claude
const toolResults = claudeToolIntegration.formatToolResults(toolCalls, results)

// Send back to Claude
await claude.chat.completions.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: [
    ...previousMessages,
    ...toolResults
  ]
})
```

## 🎮 **Frontend Usage**

### **Direct Tool Execution**
```typescript
import { toolExecutor } from '@/lib/tool-executor'

// Execute a single tool
const result = await toolExecutor.executeTool('dbUpsertPlan', {
  project_id: 'uuid-123',
  milestones: [...],
  tasks: [...]
})

if (result.success) {
  console.log('Tool executed successfully:', result.data)
} else {
  console.error('Tool execution failed:', result.error)
}
```

### **Batch Tool Execution**
```typescript
// Execute multiple tools in sequence
const results = await toolExecutor.executeTools([
  {
    toolName: 'dbUpsertPlan',
    parameters: { project_id: 'uuid-123', milestones: [...], tasks: [...] }
  },
  {
    toolName: 'storageSaveDoc',
    parameters: { project_id: 'uuid-123', filename: 'plan.md', content_md: '...' }
  }
])

// Execute multiple tools in parallel
const parallelResults = await toolExecutor.executeToolsParallel([
  { toolName: 'dbTaskEvent', parameters: { task_id: 'uuid-1', type: 'started' } },
  { toolName: 'dbTaskEvent', parameters: { task_id: 'uuid-2', type: 'started' } }
])
```

### **Parameter Validation**
```typescript
// Validate parameters before execution
const validation = toolExecutor.validateParameters('dbUpsertPlan', {
  project_id: 'uuid-123',
  milestones: [...]
})

if (validation.valid) {
  const result = await toolExecutor.executeTool('dbUpsertPlan', parameters)
} else {
  console.error('Validation errors:', validation.errors)
}
```

## 🔧 **Testing & Debugging**

### **Tool Testing Interface**
Navigate to `/platform/tools` to:
- Browse all available tools
- Test tool execution
- View parameter schemas
- See execution results
- Debug tool failures

### **API Testing**
Test tools directly via HTTP:

```bash
# Test database tool
curl -X POST http://localhost:3000/api/tools/dbUpsertPlan \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "test-123",
    "milestones": [{"title": "Test", "due_date": "2025-12-01", "order_index": 1}],
    "tasks": [{"title": "Test Task", "priority": 1, "due_in_days": 7}]
  }'

# Test storage tool
curl -X POST http://localhost:3000/api/tools/storageSaveDoc \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "test-123",
    "filename": "test.md",
    "content_md": "# Test Document\n\nThis is a test."
  }'
```

### **Error Handling**
```typescript
try {
  const result = await toolExecutor.executeTool('dbUpsertPlan', parameters)
  console.log('Success:', result.data)
} catch (error) {
  console.error('Tool execution failed:', error.message)
  
  // Check if it's a validation error
  const validation = toolExecutor.validateParameters('dbUpsertPlan', parameters)
  if (!validation.valid) {
    console.error('Validation errors:', validation.errors)
  }
}
```

## 🚀 **Production Deployment**

### **Environment Variables**
```env
# Base URL for tool execution
NEXT_PUBLIC_TOOL_BASE_URL=https://yourdomain.com

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis configuration
REDIS_URL=your_redis_url

# External API keys
SLACK_BOT_TOKEN=your_slack_token
NOTION_TOKEN=your_notion_token
```

### **Security Considerations**
- All API routes have proper error handling
- Parameters are validated before execution
- Row-level security is enforced in database
- API rate limiting can be added
- Authentication middleware can be integrated

### **Monitoring & Logging**
```typescript
// Add logging to tool execution
const result = await toolExecutor.executeTool(toolName, parameters)

// Log execution metrics
console.log(`Tool ${toolName} executed in ${result.executionTime}ms`)

// Log errors for debugging
if (!result.success) {
  console.error(`Tool ${toolName} failed:`, result.error)
}
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Tool Versioning**: Support for multiple tool versions
- **Tool Dependencies**: Define tool execution order
- **Tool Caching**: Cache frequently used tool results
- **Tool Metrics**: Track tool usage and performance
- **Tool Templates**: Pre-built tool combinations

### **Integration Roadmap**
- **More AI Models**: Support for other LLMs
- **Workflow Automation**: Visual tool workflow builder
- **Tool Marketplace**: Community-contributed tools
- **Advanced Analytics**: Tool performance insights
- **Real-time Collaboration**: Multi-user tool execution

## 📚 **Quick Reference**

### **Available Tools**
- **Database**: `dbUpsertPlan`, `dbTaskEvent`, `dbGetProjectTasks`, `dbUpdateTaskStatus`
- **Queue**: `queueEnqueueAgentRun`
- **Storage**: `storageSaveDoc`
- **Integrations**: `slackPostMessage`, `notionCreatePage`

### **Common Patterns**
```typescript
// 1. Always validate parameters first
const validation = toolExecutor.validateParameters(toolName, parameters)

// 2. Handle errors gracefully
try {
  const result = await toolExecutor.executeTool(toolName, parameters)
  // Process success
} catch (error) {
  // Handle error
}

// 3. Use batch execution for multiple tools
const results = await toolExecutor.executeToolsParallel(toolCalls)

// 4. Check execution results
if (result.success) {
  // Tool executed successfully
} else {
  // Tool failed
}
```

---

## 🎉 **You're All Set!**

Your tools are now fully integrated and ready to use by:
- ✅ **Frontend Components** - Direct tool execution
- ✅ **AI Agents** - Automated tool usage
- ✅ **Claude API** - LLM tool integration
- ✅ **External Systems** - HTTP API access

**Start building amazing AI-powered workflows! 🚀✨**

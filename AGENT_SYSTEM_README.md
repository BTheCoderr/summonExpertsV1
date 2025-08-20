# 🤖 Summon Experts Agent System

A comprehensive AI-powered project management system with intelligent agents that can plan, track, guide, and execute business strategies.

## 🏗️ **System Architecture**

```
User Goal → Planner Agent → Tracker Agent → Guide Agent → Worker Agents
    ↓              ↓            ↓           ↓           ↓
  Input    Strategic Plan   Monitor    Coaching    Execute
    ↓              ↓            ↓           ↓           ↓
  Submit    Milestones &    Progress    Nudges &    Deliverables
            Tasks          Tracking    Adjustments
```

## 🧠 **Agent Hierarchy**

### 1. **Planner Agent** (The Architect)
- **Purpose**: Creates structured roadmaps from user goals
- **Input**: Business goal, constraints, target date, context
- **Output**: Milestones, tasks, KPIs, strategic plan
- **Tools**: Database operations, document generation, worker queuing

### 2. **Tracker Agent** (The Project Manager)
- **Purpose**: Monitors task progress and manages state machine
- **Input**: Project ID, tracking mode
- **Output**: Overdue tasks, stalled tasks, blocked tasks, status updates
- **Tools**: Task analysis, automatic status updates, escalation triggers

### 3. **Guide Agent** (The Coach)
- **Purpose**: Provides coaching, nudges, and dynamic plan adjustments
- **Input**: Project issues, user preferences
- **Output**: Personalized nudges, plan adjustments, strategic insights
- **Tools**: Issue analysis, nudge generation, plan optimization

### 4. **Worker Agents** (The Specialists)
- **Marketing Agent**: Social media, campaigns, copywriting
- **Finance Agent**: Budgets, forecasts, cost analysis
- **Dev Agent**: MVP planning, integrations, website development
- **Ops Agent**: Vendor research, CRM setup, operations strategy

## 🔧 **Technical Implementation**

### **Core Technologies**
- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Queue System**: BullMQ (Redis-based)
- **Storage**: Supabase Storage
- **Integrations**: Notion API, Slack API, Email services

### **File Structure**
```
lib/
├── agents/
│   ├── planner-agent.ts      # Strategic planning
│   ├── tracker-agent.ts      # Progress monitoring
│   ├── guide-agent.ts        # Coaching & guidance
│   └── worker-agents.ts      # Specialized execution
├── tools/
│   ├── db.ts                 # Database operations
│   ├── queue.ts              # Job queuing
│   ├── storage.ts            # File management
│   └── integrations.ts       # External services
└── agent-orchestrator.ts     # Main coordinator

app/api/agents/
├── orchestrate/route.ts      # Main workflow API
└── [agent]/route.ts          # Individual agent API
```

## 🚀 **Getting Started**

### **1. Database Setup**
```sql
-- Run the complete schema in Supabase SQL editor
-- Copy and paste database-schema.sql
```

### **2. Environment Variables**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# External APIs (optional)
SLACK_BOT_TOKEN=your-slack-token
NOTION_TOKEN=your-notion-token
```

### **3. Install Dependencies**
```bash
npm install bullmq redis @supabase/supabase-js
```

### **4. Start the System**
```bash
npm run dev
```

## 📡 **API Usage**

### **Orchestrate Complete Workflow**
```typescript
// POST /api/agents/orchestrate
const response = await fetch('/api/agents/orchestrate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    goal: "Launch my Shopify store in 30 days",
    constraints: ["budget <= $1k", "owner time 5h/week"],
    target_date: "2025-11-20",
    context: {
      industry: "ecommerce",
      geo: "Providence RI"
    },
    config: {
      auto_tracking: true,
      auto_escalation: true,
      notification_channels: ["in_app", "email"]
    }
  })
});
```

### **Execute Individual Agent**
```typescript
// POST /api/agents/[agent]
const response = await fetch('/api/agents/planner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: {
      goal: "Double customers in 90 days",
      target_date: "2025-11-20"
    }
  })
});
```

### **Get Project Summary**
```typescript
// GET /api/agents/orchestrate?project_id=uuid
const response = await fetch('/api/agents/orchestrate?project_id=your-project-id');
```

## 🔄 **Workflow Examples**

### **Example 1: Business Launch**
```typescript
const orchestrator = new AgentOrchestrator({
  auto_tracking: true,
  auto_escalation: true,
  notification_channels: ['in_app', 'email']
});

const result = await orchestrator.orchestrateWorkflow({
  goal: "Launch my cleaning service in 60 days",
  constraints: ["budget <= $5k", "owner time 10h/week"],
  target_date: "2025-12-01",
  context: {
    industry: "cleaning",
    geo: "Providence RI"
  }
});
```

### **Example 2: Marketing Campaign**
```typescript
const marketingAgent = new MarketingAgent({
  task_title: "Create social media campaign",
  context: { business: "Artisan Bakery", geo: "Providence RI" }
});

const result = await marketingAgent.execute();
```

## 📊 **Data Flow**

### **1. Goal Submission**
```
User → API → Orchestrator → Planner Agent → Database
```

### **2. Task Execution**
```
Tracker Agent → Worker Agents → Database → Storage
```

### **3. Progress Monitoring**
```
Cron Job → Tracker Agent → Guide Agent → Notifications
```

### **4. Deliverables**
```
Worker Agents → Storage → Notion/Slack → User
```

## 🎯 **Key Features**

### **Intelligent Planning**
- AI-generated strategic roadmaps
- Industry-specific task templates
- Constraint-aware planning
- Automatic milestone creation

### **Smart Tracking**
- Real-time progress monitoring
- Automatic status updates
- Issue detection and escalation
- Performance analytics

### **Adaptive Coaching**
- Personalized nudges
- Dynamic plan adjustments
- Motivational messaging
- Strategic insights

### **Specialized Execution**
- Domain-specific agents
- Automated deliverables
- Integration with external tools
- Progress reporting

## 🔒 **Security & Privacy**

### **Row Level Security (RLS)**
- Organization-based data isolation
- User permission management
- Secure API endpoints
- Audit logging

### **Data Protection**
- Encrypted storage
- Secure API keys
- User authentication
- Privacy compliance

## 📈 **Performance & Scaling**

### **Queue Management**
- Redis-based job queuing
- Automatic retry logic
- Load balancing
- Performance monitoring

### **Database Optimization**
- Indexed queries
- Efficient joins
- Connection pooling
- Query optimization

## 🛠️ **Customization**

### **Adding New Agents**
```typescript
export class CustomAgent extends BaseWorkerAgent {
  async execute(): Promise<any> {
    // Custom logic here
    return { status: 'succeeded', result: 'custom output' };
  }
}
```

### **Extending Tools**
```typescript
export async function customTool(args: any) {
  // Custom tool implementation
  return { success: true, data: 'custom result' };
}
```

### **Custom Workflows**
```typescript
const customOrchestrator = new AgentOrchestrator({
  auto_tracking: false,
  auto_escalation: false,
  notification_channels: ['custom_channel']
});

// Add custom workflow logic
```

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test:unit
```

### **Integration Tests**
```bash
npm run test:integration
```

### **Agent Testing**
```typescript
// Test individual agents
const planner = new PlannerAgent(testInput);
const result = await planner.execute();
expect(result.milestones).toBeDefined();
```

## 📚 **API Reference**

### **Planner Agent**
- **Input**: `PlannerRequest`
- **Output**: `PlannerResponse`
- **Methods**: `execute()`

### **Tracker Agent**
- **Input**: `TrackerRequest`
- **Output**: `TrackerResponse`
- **Methods**: `execute()`, `updateTaskStatus()`

### **Guide Agent**
- **Input**: `GuideRequest`
- **Output**: `GuideResponse`
- **Methods**: `execute()`, `provideCoaching()`

### **Worker Agents**
- **Input**: Task-specific input
- **Output**: Execution results
- **Methods**: `execute()`

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection**
   - Check Supabase credentials
   - Verify RLS policies
   - Check table permissions

2. **Queue Issues**
   - Verify Redis connection
   - Check BullMQ configuration
   - Monitor job status

3. **Agent Failures**
   - Check agent logs
   - Verify input data
   - Check tool dependencies

### **Debug Mode**
```typescript
// Enable debug logging
process.env.DEBUG = 'agents:*';
```

## 🔮 **Future Enhancements**

### **Planned Features**
- Multi-language support
- Advanced AI models
- Mobile applications
- Real-time collaboration
- Advanced analytics
- Machine learning optimization

### **Integration Roadmap**
- Salesforce integration
- HubSpot integration
- Google Workspace
- Microsoft 365
- Slack workflows
- Discord bots

## 📞 **Support & Community**

### **Documentation**
- [API Reference](docs/api.md)
- [Agent Development Guide](docs/agent-development.md)
- [Integration Examples](docs/integrations.md)

### **Community**
- [GitHub Discussions](https://github.com/BTheCoderr/summonExpertsV1/discussions)
- [Discord Server](https://discord.gg/summonexperts)
- [Email Support](mailto:support@summonexperts.com)

### **Contributing**
- Fork the repository
- Create feature branch
- Submit pull request
- Follow coding standards

---

## 🎉 **Quick Start Demo**

```typescript
// 1. Initialize orchestrator
const orchestrator = new AgentOrchestrator({
  auto_tracking: true,
  auto_escalation: true,
  notification_channels: ['in_app']
});

// 2. Submit a goal
const result = await orchestrator.orchestrateWorkflow({
  goal: "Launch my business in 90 days",
  target_date: "2025-12-01",
  context: { industry: "tech", geo: "San Francisco" }
});

// 3. Monitor progress
const summary = await orchestrator.getProjectSummary();
console.log('Project Status:', summary);
```

**That's it! Your AI agents are now working together to plan, track, guide, and execute your business strategy! 🚀✨**

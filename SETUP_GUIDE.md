# 🚀 **Summon Experts Agent System - Complete Setup Guide**

This guide will walk you through setting up the complete AI-powered project management system with intelligent agents.

## 📋 **Prerequisites**

- Node.js 18+ installed
- Git installed
- A Supabase account (free tier works)
- Redis instance (local or cloud)
- Basic understanding of Next.js and TypeScript

## 🏗️ **Phase 1: Project Setup**

### **1.1 Clone and Install**
```bash
# Clone the repository
git clone https://github.com/BTheCoderr/summonExpertsV1.git
cd summonExpertsV1

# Install dependencies
npm install

# Install additional required packages
npm install bullmq redis @supabase/supabase-js
```

### **1.2 Environment Configuration**
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Redis Configuration (for BullMQ)
REDIS_URL=redis://localhost:6379
# OR for cloud Redis:
# REDIS_URL=redis://username:password@host:port

# External API Keys (optional)
SLACK_BOT_TOKEN=your_slack_bot_token
NOTION_TOKEN=your_notion_integration_token

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ **Phase 2: Database Setup**

### **2.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and keys

### **2.2 Run Database Schema**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `database-schema.sql`
4. Paste and run the schema
5. Verify all tables are created

### **2.3 Create Storage Buckets**
In Supabase dashboard → Storage:
```bash
# Create these buckets:
- outputs (for agent deliverables)
- task-outputs (for task-specific files)
- user-uploads (for user files)
```

### **2.4 Set Storage Policies**
```sql
-- Allow authenticated users to upload to outputs bucket
CREATE POLICY "Users can upload outputs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'outputs' AND 
  auth.role() = 'authenticated'
);

-- Allow users to view outputs from their org
CREATE POLICY "Users can view org outputs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'outputs' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  )
);
```

## 🔧 **Phase 3: Redis Setup**

### **3.1 Local Redis (Development)**
```bash
# macOS (using Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server

# Windows (using WSL or Docker)
docker run -d -p 6379:6379 redis:alpine
```

### **3.2 Cloud Redis (Production)**
- **Upstash**: Free tier available
- **Redis Cloud**: Free tier available
- **AWS ElastiCache**: Pay-per-use

### **3.3 Test Redis Connection**
```bash
# Test local connection
redis-cli ping
# Should return: PONG

# Test from your app
npm run test:redis
```

## 🤖 **Phase 4: Agent System Setup**

### **4.1 Verify Agent Files**
Ensure these files exist:
```
lib/
├── agents/
│   ├── planner-agent.ts
│   ├── tracker-agent.ts
│   ├── guide-agent.ts
│   └── worker-agents.ts
├── tools/
│   ├── db.ts
│   ├── queue.ts
│   ├── storage.ts
│   └── integrations.ts
└── agent-orchestrator.ts

app/api/agents/
├── orchestrate/route.ts
└── [agent]/route.ts
```

### **4.2 Test Agent Orchestrator**
```typescript
// Test the orchestrator
import { AgentOrchestrator } from '@/lib/agent-orchestrator';

const orchestrator = new AgentOrchestrator({
  auto_tracking: true,
  auto_escalation: true,
  notification_channels: ['in_app']
});

// Test with sample data
const result = await orchestrator.orchestrateWorkflow({
  goal: "Test business launch in 30 days",
  target_date: "2025-12-01",
  context: { industry: "tech", geo: "San Francisco" }
});
```

## 🌐 **Phase 5: API Routes Setup**

### **5.1 Verify API Routes**
Check that these routes are working:
- `POST /api/agents/orchestrate` - Main workflow
- `POST /api/agents/planner` - Planner agent
- `POST /api/agents/tracker` - Tracker agent
- `POST /api/agents/guide` - Guide agent
- `POST /api/agents/[worker]` - Worker agents

### **5.2 Test API Endpoints**
```bash
# Test the main orchestrator
curl -X POST http://localhost:3000/api/agents/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Launch my business in 90 days",
    "target_date": "2025-12-01",
    "context": {"industry": "cleaning", "geo": "Providence RI"}
  }'
```

## 🎨 **Phase 6: Frontend Integration**

### **6.1 Verify Components**
Ensure these components exist:
- `components/agent-cli.tsx` - Agent command interface
- `components/ai-workspace.tsx` - AI workspace
- `app/platform/growth-plan/page.tsx` - Strategic planning
- `app/platform/growth-lever/page.tsx` - Performance tracking

### **6.2 Test Frontend**
```bash
# Start development server
npm run dev

# Navigate to:
# - http://localhost:3000/platform - Main platform
# - http://localhost:3000/platform/growth-plan - Strategic planning
# - http://localhost:3000/platform/growth-lever - Performance tracking
```

## 🔄 **Phase 7: Cron Jobs & Automation**

### **7.1 Set Up Cron Jobs**
Create `lib/cron.ts`:
```typescript
import { CronJob } from 'cron';
import { TrackerAgent } from './agents/tracker-agent';

// Daily progress check
export const dailyProgressCheck = new CronJob('0 9 * * *', async () => {
  console.log('Running daily progress check...');
  
  // Get all active projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('status', 'active');
  
  // Run tracker agent for each project
  for (const project of projects || []) {
    const tracker = new TrackerAgent({
      project_id: project.id,
      mode: 'scan'
    });
    
    await tracker.execute();
  }
});

// Start cron jobs
dailyProgressCheck.start();
```

### **7.2 Test Automation**
```bash
# Test cron job manually
npm run test:cron

# Check logs
tail -f logs/cron.log
```

## 🧪 **Phase 8: Testing & Validation**

### **8.1 Unit Tests**
```bash
# Run unit tests
npm run test:unit

# Test specific agents
npm run test:agents

# Test tools
npm run test:tools
```

### **8.2 Integration Tests**
```bash
# Run integration tests
npm run test:integration

# Test database operations
npm run test:db

# Test queue operations
npm run test:queue
```

### **8.3 End-to-End Tests**
```bash
# Run E2E tests
npm run test:e2e

# Test complete workflow
npm run test:workflow
```

## 🚀 **Phase 9: Production Deployment**

### **9.1 Environment Setup**
```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
REDIS_URL=your_production_redis_url
```

### **9.2 Build and Deploy**
```bash
# Build the application
npm run build

# Start production server
npm start

# Or deploy to Vercel/Netlify
npm run deploy
```

### **9.3 Monitor and Scale**
- Monitor Redis queue performance
- Check Supabase usage limits
- Set up error tracking (Sentry)
- Monitor agent execution times

## 🔍 **Phase 10: Troubleshooting**

### **10.1 Common Issues**

#### **Database Connection Issues**
```bash
# Check Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT.supabase.co/rest/v1/projects?select=*&limit=1"
```

#### **Redis Connection Issues**
```bash
# Check Redis status
redis-cli ping

# Check Redis logs
tail -f /var/log/redis/redis-server.log
```

#### **Agent Execution Issues**
```bash
# Check agent logs
tail -f logs/agents.log

# Test individual agent
npm run test:agent:planner
```

### **10.2 Debug Mode**
```typescript
// Enable debug logging
process.env.DEBUG = 'agents:*';

// Add debug statements
console.log('🔍 Debug:', { input, context });
```

### **10.3 Performance Issues**
```bash
# Check database performance
EXPLAIN ANALYZE SELECT * FROM projects WHERE org_id = 'uuid';

# Check Redis performance
redis-cli --latency

# Monitor agent execution times
SELECT agent_key, AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) 
FROM agent_runs 
GROUP BY agent_key;
```

## 📊 **Phase 11: Monitoring & Analytics**

### **11.1 Set Up Monitoring**
```typescript
// Add monitoring to agents
import { monitorAgent } from '@/lib/monitoring';

export class PlannerAgent {
  async execute() {
    const startTime = Date.now();
    
    try {
      const result = await this.generateStrategicPlan();
      
      // Log success metrics
      monitorAgent('planner', 'success', Date.now() - startTime);
      
      return result;
    } catch (error) {
      // Log error metrics
      monitorAgent('planner', 'error', Date.now() - startTime, error);
      throw error;
    }
  }
}
```

### **11.2 Create Dashboards**
- Agent performance metrics
- Project completion rates
- Task execution times
- Error rates and types

## 🔐 **Phase 12: Security & Compliance**

### **12.1 Security Review**
- [ ] Row Level Security enabled
- [ ] API rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

### **12.2 Compliance Check**
- [ ] Data encryption at rest
- [ ] Secure API endpoints
- [ ] Audit logging
- [ ] User consent management
- [ ] Data retention policies

## 🎯 **Phase 13: Go Live Checklist**

### **13.1 Pre-Launch**
- [ ] All tests passing
- [ ] Database schema deployed
- [ ] Redis connection stable
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Backup strategy in place

### **13.2 Launch Day**
- [ ] Deploy to production
- [ ] Verify all endpoints
- [ ] Test agent workflows
- [ ] Monitor performance
- [ ] Check error logs
- [ ] User acceptance testing

### **13.3 Post-Launch**
- [ ] Monitor system health
- [ ] Gather user feedback
- [ ] Optimize performance
- [ ] Plan scaling strategy
- [ ] Document lessons learned

## 📚 **Additional Resources**

### **Documentation**
- [Agent System README](AGENT_SYSTEM_README.md)
- [Database Schema](database-schema.sql)
- [API Reference](docs/api.md)
- [Component Library](docs/components.md)

### **Support**
- [GitHub Issues](https://github.com/BTheCoderr/summonExpertsV1/issues)
- [Discord Community](https://discord.gg/summonexperts)
- [Email Support](mailto:support@summonexperts.com)

### **Examples**
- [Workflow Examples](examples/workflows.md)
- [Integration Examples](examples/integrations.md)
- [Custom Agent Examples](examples/custom-agents.md)

---

## 🎉 **Congratulations!**

You've successfully set up the **Summon Experts Agent System**! Your AI agents are now ready to:

✅ **Plan** strategic roadmaps  
✅ **Track** progress automatically  
✅ **Guide** with personalized coaching  
✅ **Execute** specialized tasks  
✅ **Scale** with your business needs  

### **Next Steps:**
1. **Test the system** with sample projects
2. **Customize agents** for your specific needs
3. **Integrate with your tools** (Notion, Slack, etc.)
4. **Train your team** on the new workflow
5. **Scale up** as you grow

### **Need Help?**
- Check the troubleshooting section above
- Join our Discord community
- Open a GitHub issue
- Contact our support team

**Your AI-powered business growth journey starts now! 🚀✨**

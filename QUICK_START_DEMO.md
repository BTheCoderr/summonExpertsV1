# 🚀 **Quick Start Demo - Summon Experts Agent System**

Get up and running with the AI agents in under 10 minutes! This demo will show you the complete workflow from goal submission to execution.

## ⚡ **Prerequisites Check**

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Supabase project created
- ✅ Redis running (local or cloud)
- ✅ Environment variables set

## 🎯 **Demo 1: Business Launch Workflow**

### **Step 1: Start the System**
```bash
# Start development server
npm run dev

# Open http://localhost:3000/platform
```

### **Step 2: Submit Your First Goal**
Navigate to the platform and use this sample data:

```json
{
  "goal": "Launch my artisan bakery in 60 days",
  "constraints": [
    "budget <= $5,000",
    "owner time 15h/week",
    "start with 3 core products"
  ],
  "target_date": "2025-12-01",
  "context": {
    "industry": "food",
    "geo": "Providence RI",
    "experience_level": "beginner",
    "team_size": 1
  }
}
```

### **Step 3: Watch the AI Agents Work**
The system will automatically:

1. **Planner Agent** creates your strategic roadmap
2. **Tracker Agent** monitors progress
3. **Guide Agent** provides coaching
4. **Worker Agents** execute specialized tasks

### **Step 4: Check Results**
- View your strategic plan in the Growth Plan section
- Monitor progress in the Growth Lever dashboard
- See agent-generated deliverables

## 🔄 **Demo 2: Marketing Campaign Workflow**

### **Step 1: Create Marketing Project**
```json
{
  "goal": "Launch social media campaign to get 100 new customers",
  "constraints": [
    "budget <= $1,000",
    "timeline 30 days",
    "focus on Instagram and Facebook"
  ],
  "target_date": "2025-11-30",
  "context": {
    "industry": "retail",
    "geo": "Providence RI",
    "target_audience": "25-45 professionals",
    "product": "handmade jewelry"
  }
}
```

### **Step 2: Marketing Agent Execution**
The Marketing Agent will automatically:
- Create content calendar
- Design campaign strategy
- Generate copy and messaging
- Plan posting schedule

### **Step 3: Review Deliverables**
Check the outputs section for:
- Campaign strategy document
- Content calendar
- Copy templates
- Performance metrics

## 💰 **Demo 3: Financial Planning Workflow**

### **Step 1: Submit Financial Goal**
```json
{
  "goal": "Create 3-year financial forecast and budget plan",
  "constraints": [
    "include all business expenses",
    "plan for 20% annual growth",
    "maintain 6-month cash runway"
  ],
  "target_date": "2025-11-15",
  "context": {
    "industry": "consulting",
    "geo": "San Francisco",
    "current_revenue": "$50,000/month",
    "team_size": 5
  }
}
```

### **Step 2: Finance Agent Analysis**
The Finance Agent will generate:
- Detailed budget breakdown
- Revenue projections
- Cash flow analysis
- Break-even calculations
- Cost optimization recommendations

## 🛠️ **Demo 4: Development Workflow**

### **Step 1: Submit Development Goal**
```json
{
  "goal": "Build MVP e-commerce website in 45 days",
  "constraints": [
    "budget <= $3,000",
    "must include payment processing",
    "mobile-responsive design",
    "basic analytics"
  ],
  "target_date": "2025-11-20",
  "context": {
    "industry": "ecommerce",
    "geo": "Austin TX",
    "tech_stack": "React + Node.js",
    "team_experience": "intermediate"
  }
}
```

### **Step 2: Dev Agent Planning**
The Dev Agent will create:
- Technical architecture plan
- MVP feature list
- Development timeline
- Resource requirements
- Technology recommendations

## 📊 **Demo 5: Operations Workflow**

### **Step 1: Submit Operations Goal**
```json
{
  "goal": "Set up CRM system and vendor management process",
  "constraints": [
    "budget <= $2,000",
    "implement in 30 days",
    "train team on new systems",
    "integrate with existing tools"
  ],
  "target_date": "2025-11-25",
  "context": {
    "industry": "services",
    "geo": "Miami FL",
    "current_tools": "Google Workspace, QuickBooks",
    "team_size": 8
  }
}
```

### **Step 2: Ops Agent Execution**
The Ops Agent will:
- Research CRM options
- Evaluate vendor solutions
- Create implementation plan
- Design training materials
- Plan integration strategy

## 🎮 **Interactive Demo Commands**

### **Test Individual Agents**
```bash
# Test Planner Agent
curl -X POST http://localhost:3000/api/agents/planner \
  -H "Content-Type: application/json" \
  -d '{"goal": "Test goal", "target_date": "2025-12-01"}'

# Test Tracker Agent
curl -X POST http://localhost:3000/api/agents/tracker \
  -H "Content-Type: application/json" \
  -d '{"project_id": "your-project-id", "mode": "scan"}'

# Test Guide Agent
curl -X POST http://localhost:3000/api/agents/guide \
  -H "Content-Type: application/json" \
  -d '{"project_id": "your-project-id", "issues": []}'
```

### **Test Complete Workflow**
```bash
# Test full orchestration
curl -X POST http://localhost:3000/api/agents/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Launch my business in 90 days",
    "target_date": "2025-12-01",
    "context": {"industry": "tech", "geo": "San Francisco"}
  }'
```

## 📱 **Frontend Demo Features**

### **Platform Dashboard**
- Navigate to `/platform`
- View project overview
- Access all workflows
- Check system status

### **Strategic Planning**
- Navigate to `/platform/growth-plan`
- Complete 5-phase planning process
- View AI-generated roadmap
- Track progress

### **Performance Tracking**
- Navigate to `/platform/growth-lever`
- View business metrics
- Track customer and revenue goals
- Identify missing data

### **Agent CLI**
- Use the command interface
- Execute agent commands
- View execution logs
- Monitor agent performance

## 🔍 **Demo Troubleshooting**

### **Common Issues & Solutions**

#### **Agent Not Responding**
```bash
# Check Redis connection
redis-cli ping

# Check agent logs
tail -f logs/agents.log

# Restart the system
npm run dev
```

#### **Database Errors**
```bash
# Verify Supabase connection
curl -H "apikey: YOUR_KEY" \
  "https://YOUR_PROJECT.supabase.co/rest/v1/projects"

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

#### **Frontend Not Loading**
```bash
# Clear browser cache
# Check console errors
# Verify all components exist
# Restart development server
```

## 📈 **Demo Success Metrics**

### **What to Look For**
- ✅ Agents execute without errors
- ✅ Database records created
- ✅ Files generated and stored
- ✅ Progress tracking working
- ✅ Notifications delivered
- ✅ Performance metrics updated

### **Expected Outputs**
- Strategic plan documents
- Task breakdowns
- Progress reports
- Performance analytics
- Coaching insights
- Actionable recommendations

## 🎯 **Next Steps After Demo**

### **1. Customize for Your Business**
- Modify agent logic
- Add industry-specific templates
- Customize notification channels
- Integrate with your tools

### **2. Scale Up**
- Add more worker agents
- Implement advanced workflows
- Set up automated scheduling
- Add team collaboration features

### **3. Production Deployment**
- Set up production environment
- Configure monitoring
- Implement security measures
- Plan backup strategies

## 🎉 **Demo Completion Checklist**

- [ ] All agents executed successfully
- [ ] Database records created
- [ ] Files generated and stored
- [ ] Progress tracking functional
- [ ] Notifications working
- [ ] Performance metrics updated
- [ ] Frontend components loading
- [ ] API endpoints responding
- [ ] Error handling working
- [ ] System monitoring active

---

## 🚀 **Ready to Launch?**

Your AI agents are now working! They can:

✅ **Plan** your business strategy  
✅ **Track** your progress automatically  
✅ **Guide** you with personalized coaching  
✅ **Execute** specialized tasks  
✅ **Scale** with your business needs  

**Start with the Business Launch workflow and watch your AI team go to work! 🎯✨**

### **Need Help?**
- Check the troubleshooting section
- Review the full setup guide
- Join our Discord community
- Contact support team

**Your AI-powered business growth journey starts now! 🚀**

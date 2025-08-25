# 🚀 Enhanced Summon Experts Agent Service

## Overview

This enhanced version of your agent service uses **multiple Llama models** for different agent roles, creating a more intelligent and specialized multi-agent system. Instead of paying for OpenAI/Anthropic, you get **multi-agent orchestration with free local models**.

## 🎯 Key Features

### **Multi-Model Llama Integration**
- **llama3.2:3b** - Fast execution and project management
- **llama3.2:8b** - Better reasoning for planning and strategy
- **llama3.2:14b** - High quality analysis and review
- **qwen2.5:0.5b** - Lightning fast research (397MB)
- **tinyllama:1.1b** - Fast summarization (637MB)
- **gemma2:2b** - Quality validation (1.6GB)

### **Intelligent Agent Teams**
- **OKR Team**: Planner (8b) + Coach (14b)
- **Market Team**: Analyst (14b) + Researcher (qwen2.5)
- **Strategy Team**: Strategist (8b) + Coach (14b) + Validator (gemma2)
- **Project Team**: PM (3b) + Coordinator (8b)

### **Enhanced Coordination**
- **SelectorGroupChat** for intelligent agent selection
- **Termination conditions** to prevent infinite loops
- **CORS support** for Next.js integration
- **Streaming endpoints** for real-time responses

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │───▶│  API Route      │───▶│  Python Service │
│                 │    │  /api/agent/send│    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Multi-Model     │
                       │  Llama Agents    │
                       │                 │
                       │  Planner (8b)   │
                       │  Analyst (14b)  │
                       │  Strategist (8b)│
                       │  PM (3b)        │
                       └──────────────────┘
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd autogen-agentchat/agent_service
pip install -r enhanced_requirements.txt
```

### 2. Check Ollama Models

```bash
# Check what models you have
ollama list

# Install required models
ollama pull llama3.2:3b
ollama pull llama3.2:8b
ollama pull llama3.2:14b

# Optional models for enhanced performance
ollama pull qwen2.5:0.5b
ollama pull tinyllama:1.1b
ollama pull gemma2:2b
```

### 3. Start Enhanced Service

```bash
# Use the startup script (recommended)
python start_enhanced.py

# Or start directly
python enhanced_main.py
```

### 4. Test the Service

```bash
# Health check
curl http://localhost:8081/health

# API docs
open http://localhost:8081/docs
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `agent_service` directory:

```bash
# Service configuration
AGENT_HOST=http://localhost:8081
AGENT_PORT=8081

# Model fallbacks (optional)
DEFAULT_MODEL=llama3.2:3b
PLANNING_MODEL=llama3.2:8b
QUALITY_MODEL=llama3.2:14b
```

### Next.js Integration

Add to your `.env.local`:

```bash
AGENT_HOST=http://localhost:8081
```

## 📱 Frontend Integration

### Basic Usage

```tsx
import { useMultiAgentStream } from '@/hooks/useMultiAgentStream';

function MyComponent() {
  const { sendMessage, isLoading, lastResponse, error } = useMultiAgentStream();
  
  const handleSubmit = async () => {
    const result = await sendMessage("Help me plan my business strategy", "strategy");
    console.log(result);
  };
  
  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Thinking...' : 'Ask Agents'}
      </button>
      
      {lastResponse && (
        <div>Response: {lastResponse.response}</div>
      )}
      
      {error && (
        <div>Error: {error}</div>
      )}
    </div>
  );
}
```

### Specialized Hooks

```tsx
import { useOKRAgent, useMarketAgent, useStrategyAgent } from '@/hooks/useMultiAgentStream';

// OKR planning
const okrAgent = useOKRAgent();
await okrAgent.sendOKRMessage("Create OKRs for my SaaS business");

// Market analysis
const marketAgent = useMarketAgent();
await marketAgent.sendMarketMessage("Analyze the e-commerce market");

// Strategy development
const strategyAgent = useStrategyAgent();
await strategyAgent.sendStrategyMessage("Develop a growth strategy");
```

## 🎯 Agent Types & Use Cases

### **OKR Agent** (`okr`)
- **Use Case**: Strategic planning, goal setting
- **Models**: Planner (8b) + Coach (14b)
- **Input**: Business goals, challenges, availability
- **Output**: Structured OKRs with metrics

### **Market Agent** (`market`)
- **Use Case**: Market research, opportunity analysis
- **Models**: Analyst (14b) + Researcher (qwen2.5)
- **Input**: Industry, location, business context
- **Output**: Market trends, opportunities, competitor analysis

### **Strategy Agent** (`strategy`)
- **Use Case**: Business strategy, initiative planning
- **Models**: Strategist (8b) + Coach (14b) + Validator (gemma2)
- **Input**: OKRs, market insights, business constraints
- **Output**: Strategic initiatives, execution plan

### **Roadmap Agent** (`roadmap`)
- **Use Case**: Project planning, timeline creation
- **Models**: PM (3b) + Coordinator (8b)
- **Input**: Strategy, initiatives, dependencies
- **Output**: 90-day roadmap with timelines

## 🔍 Monitoring & Debugging

### Service Health

```bash
# Check service status
curl http://localhost:8081/health

# View service info
curl http://localhost:8081/
```

### Logs

The service provides detailed logging:

```
🚀 Creating OKR Team with multiple Llama models...
🤖 Agent okr (planner) using model: llama3.2:8b
🤖 Agent okr (coach) using model: llama3.2:14b
✅ OKR Team created with specialized models
🎯 Processing OKR request with focus: balanced
```

### Model Fallbacks

If a specific model isn't available, the service automatically falls back to `llama3.2:3b`:

```
⚠️  Warning: Could not load llama3.2:14b, falling back to llama3.2:3b
```

## 🚀 Performance Tips

### **Model Selection Strategy**
- **Fast tasks** (3b, qwen2.5): Use for execution, research
- **Quality tasks** (14b, gemma2): Use for analysis, review
- **Balanced tasks** (8b): Use for planning, coordination

### **Resource Management**
- **Memory**: Larger models (14b) use more RAM but provide better quality
- **Speed**: Smaller models (3b, qwen2.5) are faster but may be less accurate
- **Balance**: Use 8b for most coordination tasks

### **Scaling**
- Start with required models (3b, 8b, 14b)
- Add optional models (qwen2.5, tinyllama, gemma2) for enhanced performance
- Monitor memory usage and adjust model selection accordingly

## 🐛 Troubleshooting

### Common Issues

#### **Service Won't Start**
```bash
# Check dependencies
pip install -r enhanced_requirements.txt

# Check Ollama
ollama serve
ollama list
```

#### **Model Not Found**
```bash
# Install missing model
ollama pull llama3.2:8b

# Check available models
ollama list
```

#### **CORS Errors**
- Ensure `AGENT_HOST` is set correctly in `.env.local`
- Check that the Python service is running on port 8081
- Verify CORS middleware is enabled

#### **Slow Responses**
- Use smaller models for faster tasks
- Check if larger models are consuming too many resources
- Consider using `qwen2.5:0.5b` for research tasks

## 🔮 Future Enhancements

### **Planned Features**
- **Real-time streaming** with Server-Sent Events
- **Agent memory** and conversation history
- **Custom model configurations** per agent
- **Performance metrics** and monitoring
- **Agent learning** from user feedback

### **Model Expansion**
- **Code-specific models** for technical tasks
- **Domain-specific models** for industry expertise
- **Multilingual models** for global business support

## 📚 Resources

### **AutoGen Documentation**
- [AutoGen AgentChat](https://microsoft.github.io/autogen/docs/agentchat/)
- [Team Coordination](https://microsoft.github.io/autogen/docs/agentchat/team/)
- [Termination Conditions](https://microsoft.github.io/autogen/docs/agentchat/termination/)

### **Ollama Models**
- [Llama 3.2 Models](https://ollama.ai/library/llama3.2)
- [Qwen Models](https://ollama.ai/library/qwen2.5)
- [TinyLlama](https://ollama.ai/library/tinyllama)
- [Gemma Models](https://ollama.ai/library/gemma2)

---

**🎉 You now have a powerful multi-agent system using free local Llama models!**

The enhanced service combines the best of AutoGen patterns with your existing business logic, creating intelligent agent teams that can handle complex strategic planning tasks without any API costs.

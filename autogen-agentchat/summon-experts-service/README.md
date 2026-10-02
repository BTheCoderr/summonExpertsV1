# Summon Experts Multi-Agent Service

A FastAPI-powered microservice that integrates Microsoft AutoGen multi-agent orchestration for business planning and growth strategies.

## 🚀 Features

- **Multi-Agent Teams**: Specialized agents for business planning and growth strategies
- **Real-time Streaming**: Server-Sent Events (SSE) for live agent collaboration
- **Session Management**: Persistent conversations with context preservation
- **AutoGen Integration**: Built on Microsoft's AutoGen AgentChat framework
- **Local LLM Support**: Uses Ollama with Llama models for privacy and cost control
- **RESTful API**: Clean HTTP endpoints for frontend integration

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/SSE    ┌─────────────────────┐
│   Next.js App  │ ◄─────────────► │  Python FastAPI    │
│   (Frontend)   │                 │   (Multi-Agent)    │
└─────────────────┘                 └─────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   AutoGen       │
                                    │  Agent Teams    │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Ollama        │
                                    │  (Llama 3.2)   │
                                    └─────────────────┘
```

## 🤖 Agent Teams

### Business Planning Team
- **StrategyPlanner**: High-level strategic direction and frameworks
- **MarketAnalyst**: Market research and competitive analysis
- **ExecutionSpecialist**: Implementation planning and operational guidance

### Growth Planning Team
- **GrowthStrategist**: Growth strategies and scaling approaches
- **FinancialAnalyst**: Financial analysis and projections
- **OperationsOptimizer**: Operational efficiency and process improvements

## 📦 Installation

1. **Navigate to the service directory:**
   ```bash
   cd autogen-agentchat/summon-experts-service
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure Ollama is running:**
   ```bash
   ollama list
   ```

## 🚀 Quick Start

### Start the Service
```bash
python start_service.py
```

Or directly with uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Access the Service
- **Health Check**: http://localhost:8000/
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Start a Session
```bash
POST /start
Content-Type: application/json

{
  "agent_type": "business_planning"
}
```

### Chat with Agents
```bash
POST /chat
Content-Type: application/json

{
  "session_id": "your-session-id",
  "message": "Help me create a 90-day growth plan",
  "agent_type": "business_planning"
}
```

### Stream Chat Responses
```bash
POST /chat/stream
Content-Type: application/json

{
  "session_id": "your-session-id",
  "message": "What are the key market opportunities?",
  "agent_type": "growth_planning"
}
```

### Get Session Info
```bash
GET /sessions/{session_id}
```

### Delete Session
```bash
DELETE /sessions/{session_id}
```

## 💬 Usage Examples

### Example 1: Business Strategy Planning
```bash
# Start a business planning session
curl -X POST "http://localhost:8000/start" \
  -H "Content-Type: application/json" \
  -d '{"agent_type": "business_planning"}'

# Chat with the team
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "message": "I want to expand my SaaS business to enterprise customers. What should I consider?",
    "agent_type": "business_planning"
  }'
```

### Example 2: Growth Strategy Development
```bash
# Start a growth planning session
curl -X POST "http://localhost:8000/start" \
  -H "Content-Type: application/json" \
  -d '{"agent_type": "growth_planning"}'

# Get streaming response
curl -X POST "http://localhost:8000/chat/stream" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "message": "How can I double my revenue in the next 12 months?",
    "agent_type": "growth_planning"
  }'
```

## 🔧 Configuration

Environment variables can be set in a `.env` file:

```bash
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8501,https://summonexperts.com

# AutoGen Configuration
OLLAMA_MODEL=llama3.2:3b
OLLAMA_BASE_URL=http://localhost:11434

# Session Management
SESSION_TIMEOUT_HOURS=24
MAX_SESSIONS_PER_USER=10
```

## 🔌 Frontend Integration

### Next.js API Route Example
```typescript
// pages/api/chat.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error calling agent service' });
  }
}
```

### React Component Example
```typescript
// components/MultiAgentChat.tsx
import { useState, useEffect } from 'react';

export default function MultiAgentChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const startSession = async (agentType: string) => {
    const response = await fetch('http://localhost:8000/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_type: agentType }),
    });
    const data = await response.json();
    setSessionId(data.session_id);
  };

  const sendMessage = async () => {
    if (!sessionId || !input.trim()) return;

    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message: input,
        agent_type: 'business_planning',
      }),
    });

    const data = await response.json();
    setMessages(prev => [...prev, { user: input, agent: data.response }]);
    setInput('');
  };

  return (
    <div>
      <button onClick={() => startSession('business_planning')}>
        Start Business Planning Session
      </button>
      
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>You:</strong> {msg.user}
            <br />
            <strong>Agent:</strong> {msg.agent}
          </div>
        ))}
      </div>
      
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your question..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## 🧪 Testing

### Test the Service
```bash
# Health check
curl http://localhost:8000/

# Start a session
curl -X POST "http://localhost:8000/start" \
  -H "Content-Type: application/json" \
  -d '{"agent_type": "business_planning"}'

# Test chat
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "message": "Hello, agents!",
    "agent_type": "business_planning"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Ollama not running:**
   ```bash
   # Start Ollama
   ollama serve
   
   # Check models
   ollama list
   ```

3. **Import errors:**
   ```bash
   # Ensure virtual environment is activated
   source ../venv/bin/activate
   
   # Reinstall dependencies
   pip install -r requirements.txt
   ```

## 🔮 Future Enhancements

- [ ] **Tool Integration**: Web search, file operations, API calls
- [ ] **Memory Management**: Long-term conversation memory
- [ ] **Multi-Model Support**: OpenAI, Anthropic, and local models
- [ ] **Advanced Orchestration**: Custom agent workflows
- [ ] **Analytics Dashboard**: Agent performance metrics
- [ ] **WebSocket Support**: Real-time bidirectional communication

## 📚 Resources

- [AutoGen Documentation](https://microsoft.github.io/autogen/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Ollama Documentation](https://ollama.ai/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Summon Experts platform and follows the same licensing terms.

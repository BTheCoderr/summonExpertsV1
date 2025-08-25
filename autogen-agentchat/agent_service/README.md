# Summon Experts Agent Service

**Minimal Python FastAPI service** that exposes endpoints for Phases 2–5 and runs AgentChat teams using **free, accessible Ollama + Llama**.

## 🚀 Quick Start

```bash
cd autogen-agentchat/agent_service
source ../venv/bin/activate
pip install -r requirements.txt
python start.py
```

**Service runs on:** http://localhost:8081

## 📡 Endpoints

- **`POST /okr`** - Phase 2: OKR Planning
- **`POST /market`** - Phase 3: Market Analysis  
- **`POST /strategy`** - Phase 4: Execution Strategy
- **`POST /roadmap`** - Phase 5: Project Roadmap

## 🤖 Agent Teams

- **OKR Team**: Planner + Coach (2 agents)
- **Market Team**: Analyst (1 agent)
- **Strategy Team**: Strategist + Coach (2 agents)
- **Project Team**: Project Manager (1 agent)

## 🔌 Next.js Integration

Update your existing routes to call the Python service:

```typescript
// Example: app/api/plans/[id]/strategy/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(process.env.AGENT_SERVICE_URL + "/strategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json({ plan: data });
}
```

## 💰 **Free & Accessible**

- ✅ **No API keys needed**
- ✅ **Uses your local Ollama + Llama 3.2:3b**
- ✅ **Completely private**
- ✅ **No usage limits**

## 🏗️ Architecture

```
Next.js Frontend → Python FastAPI → AutoGen Teams → Ollama (Llama 3.2:3b)
```

**Perfect for:** Development, testing, and production with local LLMs.

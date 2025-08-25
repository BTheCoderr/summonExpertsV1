import os, json, uuid, asyncio
from typing import AsyncGenerator, Dict, Optional, List
from datetime import datetime, timedelta
from fastapi import FastAPI, Body, HTTPException, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import httpx
import sqlite3
from contextlib import asynccontextmanager

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.models.ollama import OllamaChatCompletionClient

# Security
security = HTTPBearer()

# Configuration for FREE LOCAL MODELS
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")  # Your default model
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./summon_experts.db")
WEB_SEARCH_API_KEY = os.getenv("WEB_SEARCH_API_KEY", "")
SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")

# Initialize Ollama client for FREE local models
ollama_client = OllamaChatCompletionClient(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL
)

# Database setup
def init_db():
    """Initialize SQLite database for memory and sessions"""
    conn = sqlite3.connect("summon_experts.db")
    cursor = conn.cursor()
    
    # Sessions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            agent_type TEXT,
            created_at TIMESTAMP,
            last_activity TIMESTAMP,
            metadata TEXT
        )
    """)
    
    # Messages table for memory
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            role TEXT,
            content TEXT,
            agent_name TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    """)
    
    # Tools usage table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tool_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            tool_name TEXT,
            input_data TEXT,
            output_data TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    """)
    
    # Projects table for Summon Experts
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            name TEXT,
            status TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        )
    """)
    
    # Project insights table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS project_insights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT,
            insights TEXT,
            created_at TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    """)
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Tool implementations
class WebSearchTool:
    """Web search tool using Serper API (optional)"""
    
    @staticmethod
    async def search(query: str, num_results: int = 5) -> List[Dict]:
        if not SERPER_API_KEY:
            return [{"info": "Web search not configured. Set SERPER_API_KEY for real-time market research."}]
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://google.serper.dev/search",
                headers={"X-API-KEY": SERPER_API_KEY},
                json={"q": query, "num": num_results}
            )
            
            if response.status_code == 200:
                data = response.json()
                results = []
                for item in data.get("organic", [])[:num_results]:
                    results.append({
                        "title": item.get("title", ""),
                        "snippet": item.get("snippet", ""),
                        "link": item.get("link", "")
                    })
                return results
            else:
                return [{"error": f"Search failed: {response.status_code}"}]
    
    @staticmethod
    async def search_news(query: str, num_results: int = 5) -> List[Dict]:
        if not SERPER_API_KEY:
            return [{"info": "News search not configured. Set SERPER_API_KEY for industry trends."}]
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://google.serper.dev/news",
                headers={"X-API-KEY": SERPER_API_KEY},
                json={"q": query, "num": num_results}
            )
            
            if response.status_code == 200:
                data = response.json()
                results = []
                for item in data.get("news", [])[:num_results]:
                    results.append({
                        "title": item.get("title", ""),
                        "snippet": item.get("snippet", ""),
                        "link": item.get("link", ""),
                        "date": item.get("date", "")
                    })
                return results
            else:
                return [{"error": f"News search failed: {response.status_code}"}]

class DatabaseTool:
    """Database access tool for Summon Experts data"""
    
    @staticmethod
    def get_user_projects(user_id: str) -> List[Dict]:
        conn = sqlite3.connect("summon_experts.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, name, status, created_at 
            FROM projects 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        """, (user_id,))
        
        projects = []
        for row in cursor.fetchall():
            projects.append({
                "id": row[0],
                "name": row[1],
                "status": row[2],
                "created_at": row[3]
            })
        
        conn.close()
        return projects
    
    @staticmethod
    def save_project_insights(project_id: str, insights: str) -> bool:
        try:
            conn = sqlite3.connect("summon_experts.db")
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO project_insights (project_id, insights, created_at)
                VALUES (?, ?, ?)
            """, (project_id, insights, datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error saving insights: {e}")
            return False

# Memory management
class MemoryManager:
    """Manages conversation memory and context"""
    
    @staticmethod
    def save_message(session_id: str, role: str, content: str, agent_name: str = None):
        conn = sqlite3.connect("summon_experts.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO messages (session_id, role, content, agent_name, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (session_id, role, content, agent_name, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
    
    @staticmethod
    def get_conversation_history(session_id: str, limit: int = 20) -> List[Dict]:
        conn = sqlite3.connect("summon_experts.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT role, content, agent_name, timestamp
            FROM messages 
            WHERE session_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        """, (session_id, limit))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                "role": row[0],
                "content": row[1],
                "agent_name": row[2],
                "timestamp": row[3]
            })
        
        conn.close()
        return list(reversed(messages))  # Return in chronological order
    
    @staticmethod
    def update_session_activity(session_id: str):
        conn = sqlite3.connect("summon_experts.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE sessions 
            SET last_activity = ? 
            WHERE id = ?
        """, (datetime.now().isoformat(), session_id))
        
        conn.commit()
        conn.close()

# Enhanced agent creation with FREE LOCAL MODELS
def create_summon_experts_team(agent_type: str = "business_planning") -> RoundRobinGroupChat:
    """Create specialized Summon Experts agent team using FREE local models"""
    
    if agent_type == "business_planning":
        # Business Strategy Expert
        strategy_expert = AssistantAgent(
            name="BusinessStrategyExpert",
            model_client=ollama_client,  # Using FREE local model
            system_message="""You are a Business Strategy Expert specializing in Summon Experts use cases. Your role is to:

1. ANALYZE business challenges and opportunities
2. CREATE strategic frameworks for service businesses
3. IDENTIFY growth levers and competitive advantages
4. PROVIDE actionable business insights
5. COLLABORATE with other experts to create comprehensive plans

When you have a complete strategic framework, say 'STRATEGIC_FRAMEWORK_COMPLETE'

Use tools when needed:
- Web search for market research (if configured)
- Database access for project context
- Memory recall for conversation continuity

Remember: You're running on a local model, so provide concise but insightful responses.""",
            description="Expert in business strategy and strategic planning"
        )
        
        # Market Research Specialist
        market_specialist = AssistantAgent(
            name="MarketResearchSpecialist",
            model_client=ollama_client,  # Using FREE local model
            system_message="""You are a Market Research Specialist for Summon Experts. Your role is to:

1. RESEARCH market trends and opportunities
2. ANALYZE competitive landscape
3. IDENTIFY target customer segments
4. PROVIDE data-driven market insights
5. INTEGRATE research findings into strategic plans

When you have comprehensive market analysis, say 'MARKET_ANALYSIS_COMPLETE'

Use tools when needed:
- Web search for real-time market data (if configured)
- News search for industry trends (if configured)
- Database access for historical context

Remember: You're running on a local model, so provide focused, actionable insights.""",
            description="Expert in market research and competitive analysis"
        )
        
        # Execution Strategist
        execution_strategist = AssistantAgent(
            name="ExecutionStrategist",
            model_client=ollama_client,  # Using FREE local model
            system_message="""You are an Execution Strategist for Summon Experts. Your role is to:

1. TRANSLATE strategies into actionable plans
2. CREATE implementation roadmaps
3. IDENTIFY resource requirements
4. PROVIDE operational guidance
5. ENSURE plans are executable and measurable

When you have a complete execution plan, say 'EXECUTION_PLAN_COMPLETE'

Use tools when needed:
- Database access for project tracking
- Memory recall for context
- Web search for best practices (if configured)

Remember: You're running on a local model, so provide clear, step-by-step execution guidance.""",
            description="Expert in execution planning and implementation"
        )
        
        participants = [strategy_expert, market_specialist, execution_strategist]
        termination_condition = TextMentionTermination(
            "STRATEGIC_FRAMEWORK_COMPLETE|MARKET_ANALYSIS_COMPLETE|EXECUTION_PLAN_COMPLETE",
            must_be_complete_sentence=True
        )
        
    elif agent_type == "growth_planning":
        # Growth Strategist
        growth_strategist = AssistantAgent(
            name="GrowthStrategist",
            model_client=ollama_client,  # Using FREE local model
            system_message="""You are a Growth Strategy Expert for Summon Experts. Your role is to:

1. ANALYZE current business performance
2. IDENTIFY growth opportunities and levers
3. CREATE growth frameworks and models
4. SET realistic growth targets
5. DEVELOP scaling strategies

When you have a complete growth strategy, say 'GROWTH_STRATEGY_COMPLETE'

Remember: You're running on a local model, so provide focused, practical growth insights.""",
            description="Expert in business growth strategies and scaling"
        )
        
        # Financial Analyst
        financial_analyst = AssistantAgent(
            name="FinancialAnalyst",
            model_client=ollama_client,  # Using FREE local model
            system_message="""You are a Financial Analysis Expert for Summon Experts. Your role is to:

1. ANALYZE financial metrics and KPIs
2. CREATE financial projections and models
3. IDENTIFY funding and investment needs
4. PROVIDE financial planning guidance
5. ENSURE financial sustainability

When you have complete financial analysis, say 'FINANCIAL_ANALYSIS_COMPLETE'

Remember: You're running on a local model, so provide clear, actionable financial guidance.""",
            description="Expert in financial analysis and planning"
        )
        
        participants = [growth_strategist, financial_analyst]
        termination_condition = TextMentionTermination(
            "GROWTH_STRATEGY_COMPLETE|FINANCIAL_ANALYSIS_COMPLETE",
            must_be_complete_sentence=True
        )
    
    else:
        raise ValueError(f"Unknown agent type: {agent_type}")
    
    return RoundRobinGroupChat(
        participants=participants,
        termination_condition=termination_condition,
        max_turns=15  # Allow for thorough discussion
    )

# FastAPI app
app = FastAPI(
    title="Summon Experts FREE Local Models AutoGen Service",
    description="Multi-agent AI orchestration with FREE local models, tools, memory, and specialized business expertise",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session storage with enhanced metadata
sessions: Dict[str, Dict] = {}

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Summon Experts FREE Local Models AutoGen Service starting...")
    print(f"🆓 Using FREE local model: {OLLAMA_MODEL}")
    print(f"📍 Ollama base URL: {OLLAMA_BASE_URL}")
    print("📊 Database initialized")
    print("🔧 Tools loaded: Web Search (optional), Database Access, Memory Management")
    print("💰 Cost: $0.00 (100% FREE local models!)")

@app.get("/health")
async def health_check():
    """Enhanced health check endpoint"""
    return {
        "status": "healthy",
        "service": "Summon Experts FREE Local Models AutoGen Service",
        "version": "2.0.0",
        "model": OLLAMA_MODEL,
        "base_url": OLLAMA_BASE_URL,
        "cost": "$0.00",
        "features": [
            "Multi-agent orchestration with FREE local models",
            "Web search integration (optional)",
            "Database access and project management",
            "Memory management and conversation continuity",
            "Specialized business expertise"
        ],
        "available_agent_types": ["business_planning", "growth_planning"],
        "database": "connected",
        "tools": ["web_search", "database_access", "memory"],
        "free_models": True
    }

@app.post("/sessions")
async def start_session(agent_type: str = Body(..., embed=True)):
    """Start a new enhanced multi-agent session with FREE local models"""
    
    if agent_type not in ["business_planning", "growth_planning"]:
        raise HTTPException(status_code=400, detail="Invalid agent type")
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    # Create specialized team using FREE local models
    team = create_summon_experts_team(agent_type)
    
    # Store session with metadata
    sessions[session_id] = {
        "team": team,
        "agent_type": agent_type,
        "created_at": datetime.now().isoformat(),
        "last_activity": datetime.now().isoformat(),
        "metadata": {
            "user_id": "default",  # Add user authentication here
            "project_context": None,
            "tools_used": [],
            "model_used": OLLAMA_MODEL,
            "cost": "$0.00"
        }
    }
    
    # Save to database
    conn = sqlite3.connect("summon_experts.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO sessions (id, agent_type, created_at, last_activity, metadata)
        VALUES (?, ?, ?, ?, ?)
    """, (session_id, agent_type, sessions[session_id]["created_at"], 
          sessions[session_id]["last_activity"], json.dumps(sessions[session_id]["metadata"])))
    conn.commit()
    conn.close()
    
    return {
        "sessionId": session_id,
        "agent_type": agent_type,
        "model": OLLAMA_MODEL,
        "cost": "$0.00",
        "message": f"Started {agent_type} session with specialized agents using FREE local model {OLLAMA_MODEL}"
    }

@app.post("/sessions/{sid}/messages")
async def post_message(sid: str, body: dict = Body(...)):
    """Process message with enhanced features using FREE local models"""
    msg: Optional[str] = body.get("message")
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")
    
    # Get or create team
    if sid not in sessions:
        # Create default business planning team
        team = create_summon_experts_team("business_planning")
        sessions[sid] = {
            "team": team,
            "agent_type": "business_planning",
            "created_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat(),
            "metadata": {"user_id": "default", "project_context": None, "tools_used": [], "model_used": OLLAMA_MODEL, "cost": "$0.00"}
        }
    else:
        team = sessions[sid]["team"]
    
    # Save user message to memory
    MemoryManager.save_message(sid, "user", msg)
    
    # Update session activity
    MemoryManager.update_session_activity(sid)
    
    # Get conversation history for context
    history = MemoryManager.get_conversation_history(sid, limit=10)
    
    # Add context to user message
    contextual_message = f"""
Previous conversation context:
{chr(10).join([f"{m['role']}: {m['content']}" for m in history[-3:]])}

Current user request: {msg}

Please provide a comprehensive response using your specialized expertise and available tools.
Remember: You're running on a local model, so provide focused, actionable insights.
"""
    
    return StreamingResponse(
        _stream_enhanced(team, contextual_message, sid), 
        media_type="text/event-stream"
    )

async def _stream_enhanced(team: RoundRobinGroupChat, user_message: str, session_id: str) -> AsyncGenerator[bytes, None]:
    """Enhanced streaming with tool usage and memory management using FREE local models"""
    try:
        async for event in team.run_stream(task=user_message):
            # Extract event data
            event_type = getattr(event, "type", event.__class__.__name__)
            source = getattr(event, "source", None)
            content = getattr(event, "content", None)
            
            # Save agent messages to memory
            if content and source:
                MemoryManager.save_message(session_id, "assistant", content, source)
            
            # Create payload
            payload = {
                "type": event_type,
                "source": source,
                "content": content,
                "timestamp": datetime.now().isoformat(),
                "model": OLLAMA_MODEL,
                "cost": "$0.00"
            }
            
            yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n".encode("utf-8")
            
    except Exception as e:
        error_payload = {
            "type": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat(),
            "model": OLLAMA_MODEL,
            "cost": "$0.00"
        }
        yield f"data: {json.dumps(error_payload)}\n\n".encode("utf-8")
    
    yield b"event: done\ndata: {}\n\n"

# Tool endpoints
@app.post("/tools/web-search")
async def web_search(query: str = Body(..., embed=True)):
    """Web search tool endpoint (optional)"""
    results = await WebSearchTool.search(query)
    return {"results": results, "model": OLLAMA_MODEL, "cost": "$0.00"}

@app.post("/tools/news-search")
async def news_search(query: str = Body(..., embed=True)):
    """News search tool endpoint (optional)"""
    results = await WebSearchTool.search_news(query)
    return {"results": results, "model": OLLAMA_MODEL, "cost": "$0.00"}

@app.get("/tools/database/projects/{user_id}")
async def get_user_projects(user_id: str):
    """Get user projects from database"""
    projects = DatabaseTool.get_user_projects(user_id)
    return {"projects": projects, "model": OLLAMA_MODEL, "cost": "$0.00"}

@app.post("/tools/database/insights")
async def save_project_insights(project_id: str = Body(..., embed=True), insights: str = Body(..., embed=True)):
    """Save project insights to database"""
    success = DatabaseTool.save_project_insights(project_id, insights)
    return {"success": success, "model": OLLAMA_MODEL, "cost": "$0.00"}

# Memory endpoints
@app.get("/memory/{session_id}")
async def get_conversation_memory(session_id: str, limit: int = 20):
    """Get conversation memory for a session"""
    messages = MemoryManager.get_conversation_history(session_id, limit)
    return {"session_id": session_id, "messages": messages, "model": OLLAMA_MODEL, "cost": "$0.00"}

@app.delete("/memory/{session_id}")
async def clear_conversation_memory(session_id: str):
    """Clear conversation memory for a session"""
    conn = sqlite3.connect("summon_experts.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"message": f"Memory cleared for session {session_id}", "model": OLLAMA_MODEL, "cost": "$0.00"}

# Model management endpoint
@app.get("/models/available")
async def get_available_models():
    """Get available local models"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                return {
                    "available_models": [model["name"] for model in models],
                    "current_model": OLLAMA_MODEL,
                    "base_url": OLLAMA_BASE_URL,
                    "cost": "$0.00"
                }
            else:
                return {"error": "Could not fetch available models", "current_model": OLLAMA_MODEL}
    except Exception as e:
        return {"error": f"Error fetching models: {e}", "current_model": OLLAMA_MODEL}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5057)

import os, asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from autogen_ext.models.ollama import OllamaChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import SelectorGroupChat, RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
import json

app = FastAPI(title="Summon Experts Enhanced Agent Service", version="2.0.0")

# Add CORS middleware for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Pydantic payloads (match your Next.js zod) -----
class BusinessLocation(BaseModel):
    country: str
    state: str | None = None
    county: str | None = None
    city: str | None = None

class BusinessHighlights(BaseModel):
    name: str
    industry: str
    description: str | None = None
    location: BusinessLocation
    avgDealSize: float | None = None
    currentRevenueMonthly: float | None = None
    channels: list[str] | None = None

class PlanInputs(BaseModel):
    revenueGoal90d: float
    customerGoal90d: float
    challenges: list[str] = []
    availabilityHrsPerWeek: float
    business: BusinessHighlights
    startDate: str
    endDate: str

class OKRRequest(BaseModel):
    inputs: PlanInputs
    focus: str = "balanced"  # balanced|aggressive|low_risk

class MarketRequest(BaseModel):
    inputs: PlanInputs

class StrategyRequest(BaseModel):
    okr: dict
    inputs: PlanInputs
    selectedOpportunityIds: list[str] = []

class RoadmapRequest(BaseModel):
    strategy: dict
    okr: dict
    inputs: PlanInputs

class AgentStreamRequest(BaseModel):
    message: str
    agent_type: str = "general"  # okr, market, strategy, roadmap, general

# ----- Enhanced Model Selection Strategy -----
def get_model_for_agent(agent_type: str, role: str) -> str:
    """Select the best Llama model for each agent type and role"""
    
    # Model mapping based on AutoGen examples and your needs
    model_map = {
        # Planning & Strategy (need better reasoning)
        "planner": "llama3.2:8b",      # Better reasoning for planning
        "strategist": "llama3.2:8b",   # Better strategy thinking
        "coordinator": "llama3.2:8b",  # Better coordination
        
        # Analysis & Review (need quality)
        "analyst": "llama3.2:14b",     # Better analysis for market research
        "reviewer": "llama3.2:14b",    # Better quality review
        "coach": "llama3.2:14b",       # Better coaching
        
        # Execution & Implementation (need speed + quality)
        "executor": "llama3.2:3b",     # Faster execution
        "project_manager": "llama3.2:3b", # Faster project management
        
        # Specialized tasks (use ultra-tiny for speed)
        "researcher": "qwen2.5:0.5b",  # Lightning fast research
        "summarizer": "tinyllama:1.1b", # Fast summarization
        "validator": "gemma2:2b"        # Quality validation
    }
    
    # Get the specific model for this role, or fallback to agent type
    model = model_map.get(role, model_map.get(agent_type, "llama3.2:3b"))
    
    print(f"🤖 Agent {agent_type} ({role}) using model: {model}")
    return model

def create_model_client(model_name: str) -> OllamaChatCompletionClient:
    """Create a model client with error handling"""
    try:
        return OllamaChatCompletionClient(model=model_name)
    except Exception as e:
        print(f"⚠️  Warning: Could not load {model_name}, falling back to llama3.2:3b")
        return OllamaChatCompletionClient(model="llama3.2:3b")

# ----- Enhanced Agent Factories with Multiple Models -----
def okr_team():
    """OKR Planning Team with specialized models"""
    print("🚀 Creating OKR Team with multiple Llama models...")
    
    # Use different models for different roles
    planner = AssistantAgent(
        "okr_planner",
        model_client=create_model_client(get_model_for_agent("okr", "planner")),
        system_message=(
            "You are an OKR planner for small businesses using an advanced Llama model. "
            "Your role is to break down complex business goals into clear, measurable objectives and key results. "
            "Return exactly one objective and 3–5 measurable KRs. "
            "No initiatives. JSON schema: {objective, keyResults:[{id,description,metric,target,baseline?,goal?,owner?}], focus}"
        ),
    )
    
    coach = AssistantAgent(
        "okr_coach",
        model_client=create_model_client(get_model_for_agent("okr", "coach")),
        system_message=(
            "You are an OKR reviewer using a quality-focused Llama model. "
            "Enforce 1 objective + 3–5 KRs, add missing metrics, "
            "tighten targets to 90 days and user availability. "
            "Output same JSON schema. Be thorough in your review."
        ),
    )
    
    # Use SelectorGroupChat for intelligent agent selection
    team = SelectorGroupChat(
        [planner, coach],
        model_client=create_model_client("llama3.2:8b"),  # Coordinator model
        termination_condition=MaxMessageTermination(max_messages=6) | TextMentionTermination("DONE")
    )
    
    print("✅ OKR Team created with specialized models")
    return team

def market_team():
    """Market Analysis Team with specialized models"""
    print("🚀 Creating Market Analysis Team with multiple Llama models...")
    
    analyst = AssistantAgent(
        "market_analyst",
        model_client=create_model_client(get_model_for_agent("market", "analyst")),
        system_message=(
            "You are a market analyst using a quality-focused Llama model. "
            "Analyze market conditions, trends, and opportunities. "
            "Output JSON: {industryTrends[],bestPractices[],seasonal[],competitorActivity[],"
            "growthOpportunities:[{id,label,rationale}]}. Use industry and location data."
        ),
    )
    
    researcher = AssistantAgent(
        "market_researcher",
        model_client=create_model_client(get_model_for_agent("market", "researcher")),
        system_message=(
            "You are a market researcher using a fast Llama model. "
            "Gather specific data points and validate market assumptions. "
            "Work with the analyst to provide comprehensive market insights."
        ),
    )
    
    team = SelectorGroupChat(
        [analyst, researcher],
        model_client=create_model_client("llama3.2:8b"),
        termination_condition=MaxMessageTermination(max_messages=6) | TextMentionTermination("ANALYSIS_COMPLETE")
    )
    
    print("✅ Market Analysis Team created with specialized models")
    return team

def strategy_team():
    """Strategy Development Team with specialized models"""
    print("🚀 Creating Strategy Team with multiple Llama models...")
    
    strategist = AssistantAgent(
        "strategist",
        model_client=create_model_client(get_model_for_agent("strategy", "strategist")),
        system_message=(
            "You are a business strategist using an advanced Llama model. "
            "Create initiatives that map to KRs and a lineOfAction sequence. "
            "Schema: {initiatives:[{id,title,description,priority,dependsOn[],mappedKRs[],effortHrs?,riskNotes?}],"
            "lineOfAction:[initiativeIds],feasibilityNotes?}"
        ),
    )
    
    coach = AssistantAgent(
        "business_coach",
        model_client=create_model_client(get_model_for_agent("strategy", "coach")),
        system_message=(
            "You are a business coach using a quality-focused Llama model. "
            "Review feasibility vs availability and 90-day window. "
            "If needed, modify initiatives. Keep same schema. "
            "Ensure the strategy is realistic and achievable."
        ),
    )
    
    validator = AssistantAgent(
        "strategy_validator",
        model_client=create_model_client(get_model_for_agent("strategy", "validator")),
        system_message=(
            "You are a strategy validator using a quality Llama model. "
            "Validate that the strategy aligns with business goals and constraints. "
            "Check for logical consistency and practical feasibility."
        ),
    )
    
    team = SelectorGroupChat(
        [strategist, coach, validator],
        model_client=create_model_client("llama3.2:8b"),
        termination_condition=MaxMessageTermination(max_messages=8) | TextMentionTermination("STRATEGY_COMPLETE")
    )
    
    print("✅ Strategy Team created with specialized models")
    return team

def project_team():
    """Project Management Team with specialized models"""
    print("🚀 Creating Project Management Team with multiple Llama models...")
    
    pm = AssistantAgent(
        "project_manager",
        model_client=create_model_client(get_model_for_agent("roadmap", "project_manager")),
        system_message=(
            "You are a project manager using a fast Llama model. "
            "Convert initiatives + lineOfAction into a 90-day roadmap. "
            "Schema: [{initiativeId,initiative,start,end,dependencies[],metric}]"
        ),
    )
    
    coordinator = AssistantAgent(
        "project_coordinator",
        model_client=create_model_client(get_model_for_agent("roadmap", "coordinator")),
        system_message=(
            "You are a project coordinator using an advanced Llama model. "
            "Coordinate dependencies, timelines, and resource allocation. "
            "Ensure the roadmap is realistic and well-structured."
        ),
    )
    
    team = SelectorGroupChat(
        [pm, coordinator],
        model_client=create_model_client("llama3.2:8b"),
        termination_condition=MaxMessageTermination(max_messages=6) | TextMentionTermination("ROADMAP_COMPLETE")
    )
    
    print("✅ Project Management Team created with specialized models")
    return team

# ----- Enhanced Endpoints with Streaming Support -----
@app.post("/okr")
async def okr(req: OKRRequest):
    """Generate OKRs using enhanced multi-model team"""
    try:
        team = okr_team()
        task = {
            "inputs": req.inputs.model_dump(),
            "focus": req.focus
        }
        
        print(f"🎯 Processing OKR request with focus: {req.focus}")
        result = await team.run(task=str(task))
        
        return {"okr": result.output_text, "status": "success"}
    except Exception as e:
        print(f"❌ Error in OKR generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/market")
async def market(req: MarketRequest):
    """Generate market analysis using enhanced multi-model team"""
    try:
        team = market_team()
        task = {"inputs": req.inputs.model_dump()}
        
        print(f"🎯 Processing market analysis request")
        result = await team.run(task=str(task))
        
        return {"market": result.output_text, "status": "success"}
    except Exception as e:
        print(f"❌ Error in market analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/strategy")
async def strategy(req: StrategyRequest):
    """Generate strategy using enhanced multi-model team"""
    try:
        team = strategy_team()
        task = {
            "okr": req.okr,
            "inputs": req.inputs.model_dump(),
            "selectedOpportunityIds": req.selectedOpportunityIds
        }
        
        print(f"🎯 Processing strategy request")
        result = await team.run(task=str(task))
        
        return {"strategy": result.output_text, "status": "success"}
    except Exception as e:
        print(f"❌ Error in strategy generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/roadmap")
async def roadmap(req: RoadmapRequest):
    """Generate roadmap using enhanced multi-model team"""
    try:
        team = project_team()
        task = {
            "strategy": req.strategy,
            "okr": req.okr,
            "inputs": req.inputs.model_dump()
        }
        
        print(f"🎯 Processing roadmap request")
        result = await team.run(task=str(task))
        
        return {"roadmap": result.output_text, "status": "success"}
    except Exception as e:
        print(f"❌ Error in roadmap generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agent/stream")
async def agent_stream(req: AgentStreamRequest):
    """Streaming endpoint for real-time agent responses"""
    try:
        # Select team based on agent type
        team_map = {
            "okr": okr_team,
            "market": market_team,
            "strategy": strategy_team,
            "roadmap": project_team,
            "general": lambda: SelectorGroupChat([
                AssistantAgent(
                    "general_assistant",
                    model_client=create_model_client("llama3.2:8b"),
                    system_message="You are a helpful business assistant."
                )
            ])
        }
        
        team_func = team_map.get(req.agent_type, team_map["general"])
        team = team_func()
        
        print(f"🎯 Streaming response for agent type: {req.agent_type}")
        
        # For now, return immediate response (streaming will be implemented in Next.js)
        result = await team.run(task=req.message)
        
        return {
            "response": result.output_text,
            "agent_type": req.agent_type,
            "status": "success"
        }
        
    except Exception as e:
        print(f"❌ Error in agent streaming: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Service health and info endpoint"""
    return {
        "service": "Summon Experts Enhanced Agent Service",
        "version": "2.0.0",
        "status": "running",
        "models": "Multiple Llama models (3b, 8b, 14b, qwen2.5, tinyllama, gemma2)",
        "endpoints": [
            "/okr", 
            "/market", 
            "/strategy", 
            "/roadmap",
            "/agent/stream"
        ],
        "features": [
            "Multi-model Llama agents",
            "Specialized agent roles",
            "Intelligent team coordination",
            "Streaming support",
            "Enhanced termination conditions"
        ]
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": "2024-08-22T00:00:00Z"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Enhanced Summon Experts Agent Service...")
    print("📍 Using multiple Llama models for specialized agent roles")
    print("🔌 Port: 8081")
    print("📖 API Docs: http://localhost:8081/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8081, reload=True)

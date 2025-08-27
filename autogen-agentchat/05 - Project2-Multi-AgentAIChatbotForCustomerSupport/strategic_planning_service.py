"""
Strategic Planning Service - 5-Phase Workflow
Extends the existing multi-agent system with strategic planning capabilities
"""

from fastapi import FastAPI, Body, Query, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import AsyncGenerator, Dict, Optional
from enum import Enum
from datetime import datetime, timedelta, timezone
from pathlib import Path
import json
import uuid
import asyncio
import os

from teams_llama import (
    planning_model, operations_model, quality_model,
    AssistantAgent, SelectorGroupChat, 
    TextMentionTermination, MaxMessageTermination
)

app = FastAPI(title="Strategic Planning Multi-Agent Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for plan sessions
plan_sessions: Dict[str, dict] = {}

# File-based persistence
DATA_DIR = Path(os.getenv("PLAN_DATA_DIR", "data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
INDEX_PATH = DATA_DIR / "index.json"

class Phase(str, Enum):
    collect = "collect"
    okr = "okr" 
    market = "market"
    strategy = "strategy"
    roadmap = "roadmap"

class PlanInputs(BaseModel):
    # About Founder
    fullName: Optional[str] = None
    email: Optional[str] = None  
    phone: Optional[str] = None
    industryExperience: Optional[str] = None
    expertise: Optional[str] = None
    
    # About Business
    businessName: str
    startMonth: Optional[str] = None
    startYear: Optional[str] = None
    location: Optional[str] = None
    businessDescription: Optional[str] = None
    operationalModel: Optional[str] = None
    serviceOfferings: Optional[str] = None
    
    # Strategic Goals
    vision: Optional[str] = None
    currentStage: Optional[str] = None
    customersPerMonth: Optional[int] = None
    revenuePerMonth: Optional[float] = None
    longTermGoals: Optional[str] = None
    aspirationalGoals: Optional[str] = None
    
    # Weekly Priorities Context
    revenueGoal90d: float
    customerGoal90d: int
    challenges: Optional[str] = None
    hoursPerWeek: float

# Create specialized agents for strategic planning
def create_okr_planner() -> AssistantAgent:
    return AssistantAgent(
        "OKRPlanner",
        description="Creates OKRs (Objectives and Key Results) for strategic planning",
        model_client=planning_model,
        system_message="""You are an OKR planning expert using qwen2.5:0.5b.
        
Your job is to create exactly 1 Objective and 3-5 measurable Key Results for a 90-day period.

RULES:
- 1 clear, inspiring Objective (what we want to achieve)
- 3-5 Key Results that are specific, measurable, achievable, relevant, time-bound
- Focus on business outcomes, not activities
- Make targets realistic but ambitious
- Consider the available time and resources

OUTPUT FORMAT: Return only JSON in this exact format:
{
  "objective": "Clear 90-day objective statement",
  "keyResults": [
    {"id": "kr-1", "description": "Specific measurable result", "metric": "Metric name", "target": "Target value"},
    {"id": "kr-2", "description": "Another measurable result", "metric": "Metric name", "target": "Target value"}
  ]
}"""
    )

def create_okr_coach() -> AssistantAgent:
    return AssistantAgent(
        "OKRCoach", 
        description="Reviews and improves OKRs for clarity and achievability",
        model_client=quality_model,
        system_message="""You are an OKR coaching expert using gemma2:2b.

Your job is to review draft OKRs and improve them for:
- Clarity and specificity
- Measurability 
- Realistic yet ambitious targets
- Proper OKR structure (1 objective, 3-5 key results)
- Business impact focus

REVIEW CRITERIA:
- Is the objective clear and inspiring?
- Are key results specific and measurable?
- Are targets realistic given the timeframe and resources?
- Do the KRs directly support the objective?

OUTPUT: Return improved OKRs in the same JSON format with any necessary corrections."""
    )

def create_market_analyst() -> AssistantAgent:
    return AssistantAgent(
        "MarketAnalyst",
        description="Analyzes market opportunities and competitive landscape", 
        model_client=operations_model,
        system_message="""You are a market research expert using tinyllama:1.1b.

Your job is to analyze market opportunities for the next 90 days based on business context.

ANALYSIS AREAS:
- Industry trends affecting this business
- Growth opportunities in the target market
- Best practices for this industry and location
- Seasonal considerations for the next 90 days
- Competitive landscape insights

OUTPUT FORMAT: Return only JSON:
{
  "industryTrends": ["trend1", "trend2"],
  "bestPractices": ["practice1", "practice2"], 
  "seasonal": ["seasonal factor1", "seasonal factor2"],
  "competitorActivity": ["competitor insight1", "competitor insight2"],
  "growthOpportunities": [
    {"id": "opp-1", "title": "Opportunity name", "rationale": "Why this is a good opportunity"}
  ]
}"""
    )

def create_strategy_agent() -> AssistantAgent:
    return AssistantAgent(
        "StrategyAgent",
        description="Develops strategic execution plans",
        model_client=quality_model, 
        system_message="""You are a business strategy expert using gemma2:2b.

Your job is to convert OKRs and market insights into a concrete execution plan.

DELIVERABLES:
- 3-5 strategic initiatives with clear priorities
- Logical sequence and dependencies
- Resource requirements consideration
- Risk mitigation strategies

OUTPUT FORMAT: Return only JSON:
{
  "initiatives": [
    {
      "id": "init-1",
      "title": "Initiative name", 
      "description": "What this involves",
      "priority": 1,
      "mappedKRs": ["kr-1", "kr-2"],
      "dependsOn": [],
      "estimatedHours": 20,
      "riskLevel": "low"
    }
  ],
  "executionSequence": ["init-1", "init-2", "init-3"],
  "feasibilityNotes": "Overall feasibility assessment"
}"""
    )

def create_business_coach() -> AssistantAgent:
    return AssistantAgent(
        "BusinessCoach",
        description="Reviews strategic plans for feasibility and alignment",
        model_client=planning_model,
        system_message="""You are a business coaching expert using qwen2.5:0.5b.

Your job is to review strategic plans for:
- Feasibility given available time and resources
- Alignment with business goals and market reality
- Realistic timelines and expectations
- Risk assessment and mitigation

REVIEW FOCUS:
- Can this be achieved in 90 days with available hours?
- Does the plan align with the business context?
- Are the initiatives properly sequenced?
- What are the key risks and how to address them?

OUTPUT: Provide coaching feedback and approval recommendation."""
    )

def create_pm_agent() -> AssistantAgent:
    return AssistantAgent(
        "PMAgent", 
        description="Creates detailed project roadmaps and timelines",
        model_client=operations_model,
        system_message="""You are a project management expert using tinyllama:1.1b.

Your job is to convert strategic initiatives into a detailed 90-day roadmap.

ROADMAP REQUIREMENTS:
- Weekly breakdown (W1-W12 for 90 days)
- Specific tasks and milestones
- Dependencies and critical path
- Success metrics and checkpoints
- Resource allocation consideration

OUTPUT FORMAT: Return only JSON:
{
  "roadmap": [
    {
      "initiativeId": "init-1",
      "initiative": "Initiative name",
      "startWeek": 1,
      "endWeek": 4, 
      "dependencies": ["init-0"],
      "keyMilestones": ["milestone1", "milestone2"],
      "successMetrics": "How to measure success"
    }
  ],
  "criticalPath": ["init-1", "init-3"],
  "weeklyBreakdown": {
    "week1": ["task1", "task2"],
    "week2": ["task3", "task4"]
  }
}"""
    )

# API Endpoints

@app.post("/plan/start")
async def start_plan(inputs: PlanInputs):
    """Initialize a new strategic planning session"""
    session_id = str(uuid.uuid4())
    plan_sessions[session_id] = {
        "id": session_id,
        "inputs": inputs.dict(),
        "phase": Phase.collect,
        "created_at": asyncio.get_event_loop().time()
    }
    return {"sessionId": session_id, "phase": Phase.collect}

@app.post("/plan/run")
async def run_plan_phase(sid: str = Query(...), phase: Phase = Query(...)):
    """Execute a specific phase of the strategic planning workflow"""
    session = plan_sessions.get(sid)
    if not session:
        return StreamingResponse(
            stream_error("Invalid session ID"),
            media_type="text/event-stream"
        )
    
    async def stream_phase():
        try:
            if phase == Phase.okr:
                async for chunk in run_okr_phase(session):
                    yield chunk
            elif phase == Phase.market:
                async for chunk in run_market_phase(session):
                    yield chunk
            elif phase == Phase.strategy:
                async for chunk in run_strategy_phase(session):
                    yield chunk
            elif phase == Phase.roadmap:
                async for chunk in run_roadmap_phase(session):
                    yield chunk
            else:
                yield stream_data({"type": "error", "message": f"Unknown phase: {phase}"})
        except Exception as e:
            yield stream_data({"type": "error", "message": str(e)})
        finally:
            yield b"event: done\ndata: {}\n\n"
    
    return StreamingResponse(stream_phase(), media_type="text/event-stream")

async def run_okr_phase(session: dict) -> AsyncGenerator[bytes, None]:
    """Phase 1: OKR Planning with Coach Review"""
    session["phase"] = Phase.okr
    
    # Create agents
    planner = create_okr_planner()
    coach = create_okr_coach()
    
    # Prepare context
    inputs = session["inputs"]
    context = f"""
Business Context:
- Business: {inputs.get('businessName', 'Unnamed Business')}
- Revenue Goal (90d): ${inputs.get('revenueGoal90d', 0)}
- Customer Goal (90d): {inputs.get('customerGoal90d', 0)} customers
- Weekly Availability: {inputs.get('hoursPerWeek', 0)} hours
- Current Stage: {inputs.get('currentStage', 'Not specified')}
- Vision: {inputs.get('vision', 'Not specified')}
- Challenges: {inputs.get('challenges', 'None specified')}

Create OKRs for this 90-day period.
"""
    
    yield stream_data({"type": "phase_start", "phase": "okr", "message": "Starting OKR planning..."})
    
    # Step 1: OKR Planner drafts OKRs
    yield stream_data({"type": "agent_start", "agent": "OKRPlanner", "message": "Drafting OKRs..."})
    
    okr_draft = ""
    planner_team = SelectorGroupChat(
        [planner],
        model_client=planning_model,
        termination_condition=TextMentionTermination("DONE") | MaxMessageTermination(3)
    )
    
    async for message in planner_team.run_stream(task=context):
        content = getattr(message, 'content', str(message))
        if content:
            okr_draft = content
            yield stream_data({
                "type": "agent_message",
                "agent": "OKRPlanner", 
                "content": content[:500] + "..." if len(content) > 500 else content
            })
    
    # Step 2: OKR Coach reviews and improves
    yield stream_data({"type": "agent_start", "agent": "OKRCoach", "message": "Reviewing OKRs..."})
    
    review_context = f"Review and improve these OKRs:\n\n{okr_draft}\n\nProvide the final improved version."
    
    coach_team = SelectorGroupChat(
        [coach],
        model_client=quality_model, 
        termination_condition=TextMentionTermination("DONE") | MaxMessageTermination(3)
    )
    
    final_okrs = ""
    async for message in coach_team.run_stream(task=review_context):
        content = getattr(message, 'content', str(message))
        if content:
            final_okrs = content
            yield stream_data({
                "type": "agent_message",
                "agent": "OKRCoach",
                "content": content[:500] + "..." if len(content) > 500 else content
            })
    
    # Store results
    session["okrs"] = final_okrs
    session["okrs_draft"] = okr_draft
    
    yield stream_data({
        "type": "phase_complete", 
        "phase": "okr",
        "message": "OKR planning complete",
        "data": {"okrs": final_okrs}
    })

async def run_market_phase(session: dict) -> AsyncGenerator[bytes, None]:
    """Phase 2: Market Analysis"""
    session["phase"] = Phase.market
    
    analyst = create_market_analyst()
    inputs = session["inputs"]
    
    context = f"""
Analyze market opportunities for:
- Business: {inputs.get('businessName', 'Unnamed Business')}
- Industry: {inputs.get('businessDescription', 'Not specified')}
- Location: {inputs.get('location', 'Not specified')}
- Target: ${inputs.get('revenueGoal90d', 0)} revenue, {inputs.get('customerGoal90d', 0)} customers in 90 days
- Current Stage: {inputs.get('currentStage', 'Not specified')}

Focus on the next 90 days. Provide actionable market insights.
"""
    
    yield stream_data({"type": "phase_start", "phase": "market", "message": "Starting market analysis..."})
    yield stream_data({"type": "agent_start", "agent": "MarketAnalyst", "message": "Analyzing market opportunities..."})
    
    analyst_team = SelectorGroupChat(
        [analyst],
        model_client=operations_model,
        termination_condition=TextMentionTermination("DONE") | MaxMessageTermination(3)
    )
    
    market_analysis = ""
    async for message in analyst_team.run_stream(task=context):
        content = getattr(message, 'content', str(message))
        if content:
            market_analysis = content
            yield stream_data({
                "type": "agent_message",
                "agent": "MarketAnalyst",
                "content": content[:500] + "..." if len(content) > 500 else content
            })
    
    session["market"] = market_analysis
    
    yield stream_data({
        "type": "phase_complete",
        "phase": "market", 
        "message": "Market analysis complete",
        "data": {"market": market_analysis}
    })

async def run_strategy_phase(session: dict) -> AsyncGenerator[bytes, None]:
    """Phase 3: Strategy Development with Coach Review"""
    session["phase"] = Phase.strategy
    
    strategist = create_strategy_agent()
    coach = create_business_coach()
    
    context = f"""
Create strategic execution plan based on:

OKRs: {session.get('okrs', 'Not available')}

Market Analysis: {session.get('market', 'Not available')}

Business Context:
- Available time: {session['inputs'].get('hoursPerWeek', 0)} hours/week
- Timeline: 90 days
- Resources: Consider current stage and constraints

Create prioritized initiatives that will achieve the OKRs.
"""
    
    yield stream_data({"type": "phase_start", "phase": "strategy", "message": "Developing strategy..."})
    yield stream_data({"type": "agent_start", "agent": "StrategyAgent", "message": "Creating strategic plan..."})
    
    # Strategy development
    strategy_team = SelectorGroupChat(
        [strategist],
        model_client=quality_model,
        termination_condition=TextMentionTermination("DONE") | MaxMessageTermination(3) 
    )
    
    strategy_plan = ""
    async for message in strategy_team.run_stream(task=context):
        content = getattr(message, 'content', str(message))
        if content:
            strategy_plan = content
            yield stream_data({
                "type": "agent_message",
                "agent": "StrategyAgent",
                "content": content[:500] + "..." if len(content) > 500 else content
            })
    
    # Business coach review
    yield stream_data({"type": "agent_start", "agent": "BusinessCoach", "message": "Reviewing strategic plan..."})
    
    review_context = f"Review this strategic plan for feasibility and alignment:\n\n{strategy_plan}\n\nProvide coaching feedback."
    
    coach_team = SelectorGroupChat(
        [coach],
        model_client=planning_model,
        termination_condition=TextMentionTermination("DONE") | MaxMessageTermination(3)
    )
    
    coach_feedback = ""
    async for message in coach_team.run_stream(task=review_context):
        content = getattr(message, 'content', str(message))
        if content:
            coach_feedback = content
            yield stream_data({
                "type": "agent_message", 
                "agent": "BusinessCoach",
                "content": content[:500] + "..." if len(content) > 500 else content
            })
    
    session["strategy"] = strategy_plan
    session["strategy_review"] = coach_feedback
    
    yield stream_data({
        "type": "phase_complete",
        "phase": "strategy",
        "message": "Strategy development complete", 
        "data": {"strategy": strategy_plan, "review": coach_feedback}
    })

async def run_roadmap_phase(session: dict) -> AsyncGenerator[bytes, None]:
    """Phase 4: Roadmap Creation""" 
    session["phase"] = Phase.roadmap
    
    pm = create_pm_agent()
    
    context = f"""
Create detailed 90-day roadmap from this strategic plan:

{session.get('strategy', 'Strategy not available')}

Requirements:
- Break into weekly timeline (W1-W12)
- Show dependencies and critical path
- Include milestones and success metrics
- Consider {session['inputs'].get('hoursPerWeek', 0)} hours/week availability

Create a practical, week-by-week execution plan.
"""
    
    yield stream_data({"type": "phase_start", "phase": "roadmap", "message": "Creating roadmap..."})
    yield stream_data({"type": "agent_start", "agent": "PMAgent", "message": "Building project roadmap..."})
    
    pm_team = SelectorGroupChat(
        [pm],
        model_client=operations_model,
        termination_condition=TextMentionTermination("DONE") | MaxMessageTermination(3)
    )
    
    roadmap = ""
    async for message in pm_team.run_stream(task=context):
        content = getattr(message, 'content', str(message))
        if content:
            roadmap = content
            yield stream_data({
                "type": "agent_message",
                "agent": "PMAgent", 
                "content": content[:500] + "..." if len(content) > 500 else content
            })
    
    session["roadmap"] = roadmap
    session["phase"] = "complete"
    
    yield stream_data({
        "type": "phase_complete",
        "phase": "roadmap",
        "message": "Strategic plan complete!",
        "data": {"roadmap": roadmap}
    })

@app.post("/plan/confirm")
async def confirm_phase(data: dict = Body(...)):
    """Confirm phase completion and store user selections"""
    sid = data.get("sessionId")
    phase = data.get("phase") 
    user_data = data.get("data", {})
    
    if not sid or sid not in plan_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = plan_sessions[sid]
    session[f"{phase}_confirmed"] = user_data
    
    return {"success": True, "message": f"Phase {phase} confirmed"}

@app.get("/plan/{session_id}")
async def get_plan(session_id: str):
    """Get current plan state"""
    if session_id not in plan_sessions:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return plan_sessions[session_id]

# Utility functions
def stream_data(data: dict) -> bytes:
    """Convert data to SSE format"""
    return f"data: {json.dumps(data)}\n\n".encode()

async def stream_error(message: str) -> AsyncGenerator[bytes, None]:
    """Stream error message"""
    yield stream_data({"type": "error", "message": message})

# -------- Persistence helpers --------
def _now_iso():
    return datetime.now(timezone.utc).isoformat()

def _date_iso(d: datetime):
    return d.date().isoformat()

def _aggregate_plan(sid: str) -> dict:
    s = plan_sessions.get(sid, {})
    # Default range: today -> +90 days (can be overridden by a real scheduler later)
    start = _date_iso(datetime.now(timezone.utc))
    end = _date_iso(datetime.now(timezone.utc) + timedelta(days=90))
    title = f"Strategic Plan for {start} – {end}"
    return {
        "sid": sid,
        "title": title,
        "start": start,
        "end": end,
        "savedAt": _now_iso(),
        "inputs": s.get("inputs"),
        "okrs_draft": s.get("okrs_draft"),
        "okrs": s.get("okrs"),
        "market": s.get("market"),
        "plan": s.get("plan"),
        "plan_review": s.get("plan_review"),
        "roadmap": s.get("roadmap"),
    }

def _read_index() -> list:
    if INDEX_PATH.exists():
        try:
            return json.loads(INDEX_PATH.read_text())
        except Exception:
            return []
    return []

def _write_index(entries: list):
    INDEX_PATH.write_text(json.dumps(entries, ensure_ascii=False, indent=2))

@app.get("/plan/export")
async def plan_export(sid: str):
    """Export plan data as JSON"""
    if sid not in plan_sessions:
        return JSONResponse({"error": "invalid sid"}, status_code=400)
    return JSONResponse(_aggregate_plan(sid))

@app.post("/plan/save")
async def plan_save(sid: str):
    """Save plan to persistent storage"""
    if sid not in plan_sessions:
        return JSONResponse({"error": "invalid sid"}, status_code=400)
    doc = _aggregate_plan(sid)
    fname = f"{sid}.json"
    (DATA_DIR / fname).write_text(json.dumps(doc, ensure_ascii=False, indent=2))
    # update index (latest first)
    idx = _read_index()
    # remove any existing entry for sid
    idx = [e for e in idx if e.get("sid") != sid]
    idx.insert(0, {"sid": sid, "title": doc["title"], "savedAt": doc["savedAt"]})
    _write_index(idx)
    return JSONResponse({"ok": True, "sid": sid, "title": doc["title"]})

@app.get("/plan/list")
async def plan_list():
    """List all saved plans"""
    return JSONResponse({"plans": _read_index()})

@app.get("/plan/get")
async def plan_get(sid: str):
    """Get a specific saved plan"""
    fp = DATA_DIR / f"{sid}.json"
    if not fp.exists():
        return JSONResponse({"error": "not found"}, status_code=404)
    try:
        return JSONResponse(json.loads(fp.read_text()))
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Strategic Planning Multi-Agent System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5057, reload=True)

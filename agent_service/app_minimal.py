import os, json, uuid
from datetime import datetime
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI(
    title="Summon Experts AutoGen Minimal Service",
    description="Minimal service for testing the flow",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage
sessions = {}

@app.get("/health")
async def health_check():
    """Simple health check"""
    return {
        "status": "healthy",
        "service": "Summon Experts AutoGen Minimal Service",
        "version": "1.0.0",
        "model": "llama3.2:3b",
        "base_url": "http://localhost:11434",
        "cost": "$0.00",
        "features": ["Multi-agent orchestration with FREE local models"],
        "available_agent_types": ["business_planning", "growth_planning"],
        "database": "in_memory",
        "tools": ["basic"],
        "free_models": True
    }

@app.post("/sessions")
async def start_session(agent_type: str = Body(..., embed=True)):
    """Start a new test session"""
    
    if agent_type not in ["business_planning", "growth_planning"]:
        raise HTTPException(status_code=400, detail="Invalid agent type")
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    # Store session
    sessions[session_id] = {
        "agent_type": agent_type,
        "created_at": datetime.now().isoformat(),
        "last_activity": datetime.now().isoformat(),
        "metadata": {
            "user_id": "default",
            "project_context": None,
            "model_used": "llama3.2:3b",
            "cost": "$0.00"
        }
    }
    
    return {
        "sessionId": session_id,
        "agent_type": agent_type,
        "model": "llama3.2:3b",
        "cost": "$0.00",
        "message": f"Started {agent_type} session with specialized agents using FREE local model llama3.2:3b"
    }

@app.post("/sessions/{sid}/messages")
async def post_message(sid: str, body: dict = Body(...)):
    """Process message with simulated multi-agent response"""
    msg: str = body.get("message")
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")
    
    if sid not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Simulate multi-agent collaboration
    return StreamingResponse(
        _stream_simulated_response(msg, sid), 
        media_type="text/event-stream"
    )

async def _stream_simulated_response(user_message: str, session_id: str):
    """Simulate streaming response from multiple agents"""
    
    # Simulate Business Strategy Expert
    yield f"data: {json.dumps({'type': 'agent_response', 'source': 'BusinessStrategyExpert', 'content': 'Analyzing your request for strategic planning...', 'timestamp': datetime.now().isoformat()})}\n\n"
    await asyncio.sleep(1)
    
    # Simulate Market Research Specialist
    yield f"data: {json.dumps({'type': 'agent_response', 'source': 'MarketResearchSpecialist', 'content': 'Researching market opportunities and competitive landscape...', 'timestamp': datetime.now().isoformat()})}\n\n"
    await asyncio.sleep(1)
    
    # Simulate Execution Strategist
    yield f"data: {json.dumps({'type': 'agent_response', 'source': 'ExecutionStrategist', 'content': 'Creating actionable implementation plan...', 'timestamp': datetime.now().isoformat()})}\n\n"
    await asyncio.sleep(1)
    
    # Final comprehensive response
    final_response = f"""Based on our collaborative analysis, here's your strategic plan:

🎯 **Business Strategy**: {user_message} requires a focused approach with clear objectives and measurable outcomes.

📊 **Market Analysis**: We've identified key opportunities in your target market with competitive advantages.

🚀 **Execution Plan**: A 90-day roadmap with specific milestones, resource requirements, and success metrics.

This plan leverages our combined expertise in business strategy, market research, and execution planning to deliver actionable results."""
    
    yield f"data: {json.dumps({'type': 'agent_response', 'source': 'StrategicTeam', 'content': final_response, 'timestamp': datetime.now().isoformat()})}\n\n"
    
    # End of stream
    yield "event: done\ndata: \n\n"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5057)

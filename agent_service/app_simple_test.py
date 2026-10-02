import os, json, uuid
from datetime import datetime
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Summon Experts AutoGen Test Service",
    description="Simple test service for debugging",
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
        "service": "Summon Experts AutoGen Test Service",
        "version": "1.0.0",
        "message": "Simple test service is running"
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
            "model_used": "test_model",
            "cost": "$0.00"
        }
    }
    
    return {
        "sessionId": session_id,
        "agent_type": agent_type,
        "model": "test_model",
        "cost": "$0.00",
        "message": f"Started {agent_type} test session"
    }

@app.post("/sessions/{sid}/messages")
async def post_message(sid: str, body: dict = Body(...)):
    """Process message with simple response"""
    msg: str = body.get("message")
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")
    
    if sid not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Simple response for testing
    response = f"Test response to: {msg}"
    
    return {
        "response": response,
        "session_id": sid,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5058)

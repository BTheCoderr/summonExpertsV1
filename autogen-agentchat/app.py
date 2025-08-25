import os
import json
import uuid
from typing import AsyncGenerator, Dict
from fastapi import FastAPI, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.models.anthropic import AnthropicCompletionClient

app = FastAPI(title="Summon Experts AutoGen Service", version="1.0.0")

# Add CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your Next.js URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global session storage
sessions: Dict[str, RoundRobinGroupChat] = {}

# Initialize model clients once
gpt = OpenAIChatCompletionClient(model=os.getenv("OPENAI_MODEL", "gpt-4o"))
claude = AnthropicCompletionClient(model=os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet"))

def build_team() -> RoundRobinGroupChat:
    """Create a new agent team with planner and writer roles"""
    planner = AssistantAgent(
        name="Planner",
        model_client=gpt,
        system_message="You are a senior strategist who breaks problems into steps and proposes a clear plan. Be concise and actionable."
    )
    writer = AssistantAgent(
        name="Writer",
        model_client=claude,
        system_message="You turn plans into concise, user-ready answers. End your final message with the word DONE."
    )
    
    # Termination condition - stop when writer says DONE
    term = TextMentionTermination("DONE", must_be_complete_sentence=False)
    
    return RoundRobinGroupChat(
        participants=[planner, writer], 
        termination_condition=term, 
        max_turns=6
    )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Summon Experts AutoGen Service"}

@app.post("/sessions")
async def start_session():
    """Create a new chat session"""
    sid = str(uuid.uuid4())
    sessions[sid] = build_team()
    return {"sessionId": sid, "status": "created"}

@app.get("/sessions/{sid}")
async def get_session(sid: str):
    """Get session status"""
    if sid in sessions:
        return {"sessionId": sid, "status": "active"}
    return {"sessionId": sid, "status": "not_found"}

async def stream_team(team: RoundRobinGroupChat, user_message: str) -> AsyncGenerator[bytes, None]:
    """Stream team responses as Server-Sent Events"""
    try:
        async for event in team.run_stream(task=user_message):
            # Format different event types
            try:
                payload = {
                    "type": getattr(event, "type", event.__class__.__name__),
                    "source": getattr(event, "source", None),
                    "content": getattr(event, "content", None),
                    "timestamp": getattr(event, "timestamp", None),
                }
                yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n".encode("utf-8")
            except Exception as e:
                yield f"data: {json.dumps({'type':'error','message':str(e)})}\n\n".encode("utf-8")
        
        # Signal end of turn
        yield b"event: done\ndata: {}\n\n"
        
    except Exception as e:
        yield f"data: {json.dumps({'type':'error','message':f'Team execution failed: {str(e)}'})}\n\n".encode("utf-8")
        yield b"event: done\ndata: {}\n\n"

@app.post("/sessions/{sid}/messages")
async def post_message(sid: str, body: dict = Body(...)):
    """Send a message to the team and stream the response"""
    msg = body.get("message", "")
    if not msg:
        return {"error": "Message is required"}
    
    # Get or create team for this session
    team = sessions.get(sid)
    if team is None:
        team = build_team()
        sessions[sid] = team
    
    return StreamingResponse(
        stream_team(team, msg), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Session-Id": sid
        }
    )

@app.delete("/sessions/{sid}")
async def delete_session(sid: str):
    """Clean up a session"""
    if sid in sessions:
        del sessions[sid]
        return {"sessionId": sid, "status": "deleted"}
    return {"sessionId": sid, "status": "not_found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5057)

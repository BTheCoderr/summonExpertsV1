import os, json, uuid
from typing import AsyncGenerator, Dict, Optional
from fastapi import FastAPI, Body, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.models.openai import OpenAIChatCompletionClient

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your domains in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions: Dict[str, RoundRobinGroupChat] = {}

# Model configuration
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

# Initialize client lazily to avoid API key errors during import
gpt_client = None

def get_gpt_client():
    global gpt_client
    if gpt_client is None:
        gpt_client = OpenAIChatCompletionClient(model=OPENAI_MODEL)
    return gpt_client

def build_team() -> RoundRobinGroupChat:
    client = get_gpt_client()
    planner = AssistantAgent(
        name="Planner",
        model_client=client,
        system_message="You are a senior strategist. Break the problem into steps and propose a plan."
    )
    writer = AssistantAgent(
        name="Writer",
        model_client=client,
        system_message="Turn the plan into a concise final answer. End your final message with DONE"
    )
    term = TextMentionTermination("DONE", must_be_complete_sentence=False)
    return RoundRobinGroupChat(
        participants=[planner, writer],
        termination_condition=term,
        max_turns=6
    )

@app.post("/sessions")
async def start_session():
    sid = str(uuid.uuid4())
    sessions[sid] = build_team()
    return {"sessionId": sid}

async def _stream(team: RoundRobinGroupChat, user_message: str) -> AsyncGenerator[bytes, None]:
    try:
        async for event in team.run_stream(task=user_message):
            payload = {
                "type": getattr(event, "type", event.__class__.__name__),
                "source": getattr(event, "source", None),
                "content": getattr(event, "content", None),
            }
            yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n".encode("utf-8")
    except Exception as e:
        yield f"data: {json.dumps({'type':'error','message':str(e)})}\n\n".encode("utf-8")
    yield b"event: done\ndata: {}\n\n"

@app.post("/sessions/{sid}/messages")
async def post_message(sid: str, body: dict = Body(...)):
    msg: Optional[str] = body.get("message")
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")
    team = sessions.get(sid) or build_team()
    sessions[sid] = team
    return StreamingResponse(_stream(team, msg), media_type="text/event-stream")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

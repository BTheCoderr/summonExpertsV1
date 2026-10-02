#!/usr/bin/env python3
"""
Summon Experts Multi-Agent Service
FastAPI backend for AutoGen multi-agent orchestration
"""

import asyncio
import json
import uuid
from typing import Dict, Optional, List
from datetime import datetime

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.models.ollama import OllamaChatCompletionClient

# Initialize FastAPI app
app = FastAPI(
    title="Summon Experts Multi-Agent Service",
    description="AutoGen-powered multi-agent orchestration for business planning",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    agent_type: Optional[str] = "business_planning"

class ChatResponse(BaseModel):
    session_id: str
    message: str
    agent_name: str
    timestamp: str

# Global session storage (use Redis in production)
sessions: Dict[str, Dict] = {}

# Initialize Ollama client (using your local Llama model)
llama_client = OllamaChatCompletionClient(model='llama3.2:3b')

# Create specialized agents
def create_business_planning_team():
    """Create a team of specialized business planning agents"""
    
    # Business Strategy Planner
    strategy_planner = AssistantAgent(
        name="StrategyPlanner",
        model_client=llama_client,
        system_message="""You are a Business Strategy Expert. Your role is to:
        1. Analyze business goals and market conditions
        2. Create strategic frameworks and planning approaches
        3. Identify key success factors and risks
        4. Provide high-level strategic direction
        5. When you have a complete strategic plan, say 'STRATEGIC_PLAN_COMPLETE'""",
        description="Expert in business strategy and strategic planning"
    )
    
    # Market Research Analyst
    market_analyst = AssistantAgent(
        name="MarketAnalyst",
        model_client=llama_client,
        system_message="""You are a Market Research Expert. Your role is to:
        1. Analyze market trends and opportunities
        2. Research competitive landscape
        3. Identify target customer segments
        4. Provide market insights and data
        5. When you have comprehensive market analysis, say 'MARKET_ANALYSIS_COMPLETE'""",
        description="Expert in market research and competitive analysis"
    )
    
    # Execution Specialist
    execution_specialist = AssistantAgent(
        name="ExecutionSpecialist",
        model_client=llama_client,
        system_message="""You are an Execution and Implementation Expert. Your role is to:
        1. Break down strategies into actionable steps
        2. Create implementation timelines and milestones
        3. Identify resource requirements and dependencies
        4. Provide operational guidance
        5. When you have a complete execution plan, say 'EXECUTION_PLAN_COMPLETE'""",
        description="Expert in execution planning and implementation"
    )
    
    # Create team with termination condition
    termination = TextMentionTermination(
        "STRATEGIC_PLAN_COMPLETE|MARKET_ANALYSIS_COMPLETE|EXECUTION_PLAN_COMPLETE",
        must_be_complete_sentence=True
    )
    
    team = RoundRobinGroupChat(
        participants=[strategy_planner, market_analyst, execution_specialist],
        termination_condition=termination,
        max_turns=12  # Allow for thorough discussion
    )
    
    return team

def create_growth_planning_team():
    """Create a team specialized in growth planning"""
    
    # Growth Strategist
    growth_strategist = AssistantAgent(
        name="GrowthStrategist",
        model_client=llama_client,
        system_message="""You are a Growth Strategy Expert. Your role is to:
        1. Analyze current business performance
        2. Identify growth opportunities and levers
        3. Create growth frameworks and models
        4. Set realistic growth targets
        5. When you have a complete growth strategy, say 'GROWTH_STRATEGY_COMPLETE'""",
        description="Expert in business growth strategies and scaling"
    )
    
    # Financial Analyst
    financial_analyst = AssistantAgent(
        name="FinancialAnalyst",
        model_client=llama_client,
        system_message="""You are a Financial Analysis Expert. Your role is to:
        1. Analyze financial metrics and KPIs
        2. Create financial projections and models
        3. Identify funding and investment needs
        4. Provide financial planning guidance
        5. When you have complete financial analysis, say 'FINANCIAL_ANALYSIS_COMPLETE'""",
        description="Expert in financial analysis and planning"
    )
    
    # Operations Optimizer
    operations_optimizer = AssistantAgent(
        name="OperationsOptimizer",
        model_client=llama_client,
        system_message="""You are an Operations Optimization Expert. Your role is to:
        1. Analyze operational efficiency
        2. Identify process improvements
        3. Create operational roadmaps
        4. Provide scaling guidance
        5. When you have complete operations plan, say 'OPERATIONS_PLAN_COMPLETE'""",
        description="Expert in operations optimization and scaling"
    )
    
    termination = TextMentionTermination(
        "GROWTH_STRATEGY_COMPLETE|FINANCIAL_ANALYSIS_COMPLETE|OPERATIONS_PLAN_COMPLETE",
        must_be_complete_sentence=True
    )
    
    team = RoundRobinGroupChat(
        participants=[growth_strategist, financial_analyst, operations_optimizer],
        termination_condition=termination,
        max_turns=12
    )
    
    return team

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Summon Experts Multi-Agent Service",
        "status": "running",
        "version": "1.0.0",
        "available_agents": ["business_planning", "growth_planning"]
    }

@app.post("/start")
async def start_session(agent_type: str = Body(..., embed=True)):
    """Start a new multi-agent session"""
    
    if agent_type not in ["business_planning", "growth_planning"]:
        raise HTTPException(status_code=400, detail="Invalid agent type")
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    # Create appropriate team
    if agent_type == "business_planning":
        team = create_business_planning_team()
    else:
        team = create_growth_planning_team()
    
    # Store session
    sessions[session_id] = {
        "team": team,
        "agent_type": agent_type,
        "created_at": datetime.utcnow().isoformat(),
        "messages": []
    }
    
    return {
        "session_id": session_id,
        "agent_type": agent_type,
        "status": "started",
        "message": f"Multi-agent {agent_type} session created successfully"
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat with the multi-agent team"""
    
    if not request.session_id or request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[request.session_id]
    team = session["team"]
    
    try:
        # Run the multi-agent conversation
        result = await team.run(task=request.message)
        
        # Extract the final response
        final_messages = result.messages
        last_message = final_messages[-1] if final_messages else None
        
        # Store conversation
        session["messages"].append({
            "user_message": request.message,
            "agent_response": last_message.content if last_message else "No response generated",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {
            "session_id": request.session_id,
            "response": last_message.content if last_message else "No response generated",
            "agent_name": last_message.source if last_message else "Unknown",
            "timestamp": datetime.utcnow().isoformat(),
            "total_messages": len(final_messages)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution error: {str(e)}")

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Stream chat responses from the multi-agent team"""
    
    if not request.session_id or request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[request.session_id]
    team = session["team"]
    
    async def generate_stream():
        try:
            # Stream the multi-agent conversation
            async for event in team.run_stream(task=request.message):
                # Format event for streaming
                if hasattr(event, 'content'):
                    event_data = {
                        "type": "message",
                        "agent_name": getattr(event, 'source', 'Unknown'),
                        "content": event.content,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    yield f"data: {json.dumps(event_data)}\n\n"
                
                # Check for termination
                if hasattr(event, 'content') and any(
                    term in event.content for term in [
                        "STRATEGIC_PLAN_COMPLETE", "MARKET_ANALYSIS_COMPLETE", 
                        "EXECUTION_PLAN_COMPLETE", "GROWTH_STRATEGY_COMPLETE",
                        "FINANCIAL_ANALYSIS_COMPLETE", "OPERATIONS_PLAN_COMPLETE"
                    ]
                ):
                    # Send completion signal
                    completion_data = {
                        "type": "completion",
                        "message": "Multi-agent conversation completed",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    yield f"data: {json.dumps(completion_data)}\n\n"
                    break
            
        except Exception as e:
            error_data = {
                "type": "error",
                "message": f"Streaming error: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session information and history"""
    
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    return {
        "session_id": session_id,
        "agent_type": session["agent_type"],
        "created_at": session["created_at"],
        "message_count": len(session["messages"]),
        "messages": session["messages"]
    }

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and clean up resources"""
    
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Clean up session
    del sessions[session_id]
    
    return {
        "session_id": session_id,
        "status": "deleted",
        "message": "Session cleaned up successfully"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

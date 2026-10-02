import os, asyncio
from fastapi import FastAPI
from pydantic import BaseModel
from autogen_ext.models.ollama import OllamaChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import SelectorGroupChat

app = FastAPI()

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

def model_client():
    # Use Ollama with your local Llama model (free and accessible!)
    return OllamaChatCompletionClient(model="llama3.2:3b")

# ----- Agent factories -----
def okr_team():
    mc = model_client()
    planner = AssistantAgent(
        "okr_planner",
        model_client=mc,
        system_message=(
            "You are an OKR planner for small businesses. "
            "Return exactly one objective and 3–5 measurable KRs. "
            "No initiatives. JSON schema: {objective, keyResults:[{id,description,metric,target,baseline?,goal?,owner?}], focus}"
        ),
    )
    coach = AssistantAgent(
        "okr_coach",
        model_client=mc,
        system_message=(
            "You are an OKR reviewer. Enforce 1 objective + 3–5 KRs, add missing metrics, "
            "tighten targets to 90 days and user availability. Output same JSON schema."
        ),
    )
    return SelectorGroupChat([planner, coach])  # simple 2-agent selector loop

def market_team():
    mc = model_client()
    analyst = AssistantAgent(
        "market_analyst",
        model_client=mc,
        system_message=(
            "Market analyst. Output JSON: {industryTrends[],bestPractices[],seasonal[],competitorActivity[],"
            "growthOpportunities:[{id,label,rationale}]}. Use industry and location."
        ),
    )
    return SelectorGroupChat([analyst])

def strategy_team():
    mc = model_client()
    strategist = AssistantAgent(
        "strategist",
        model_client=mc,
        system_message=(
            "Create initiatives that map to KRs and a lineOfAction sequence. "
            "Schema: {initiatives:[{id,title,description,priority,dependsOn[],mappedKRs[],effortHrs?,riskNotes?}],"
            "lineOfAction:[initiativeIds],feasibilityNotes?}"
        ),
    )
    coach = AssistantAgent(
        "business_coach",
        model_client=mc,
        system_message=(
            "Review feasibility vs availability and 90-day window. If needed, modify initiatives. Keep same schema."
        ),
    )
    return SelectorGroupChat([strategist, coach])

def project_team():
    mc = model_client()
    pm = AssistantAgent(
        "project_manager",
        model_client=mc,
        system_message=(
            "Convert initiatives + lineOfAction into a 90-day roadmap. "
            "Schema: [{initiativeId,initiative,start,end,dependencies[],metric}]"
        ),
    )
    return SelectorGroupChat([pm])

# ----- Endpoints -----
@app.post("/okr")
async def okr(req: OKRRequest):
    team = okr_team()
    task = {
        "inputs": req.inputs.model_dump(),
        "focus": req.focus
    }
    result = await team.run(task=str(task))
    return {"okr": result.output_text}

@app.post("/market")
async def market(req: MarketRequest):
    team = market_team()
    task = {"inputs": req.inputs.model_dump()}
    result = await team.run(task=str(task))
    return {"market": result.output_text}

@app.post("/strategy")
async def strategy(req: StrategyRequest):
    team = strategy_team()
    task = {
        "okr": req.okr,
        "inputs": req.inputs.model_dump(),
        "selectedOpportunityIds": req.selectedOpportunityIds
    }
    result = await team.run(task=str(task))
    return {"strategy": result.output_text}

@app.post("/roadmap")
async def roadmap(req: RoadmapRequest):
    team = project_team()
    task = {
        "strategy": req.strategy,
        "okr": req.okr,
        "inputs": req.inputs.model_dump()
    }
    result = await team.run(task=str(task))
    return {"roadmap": result.output_text}

@app.get("/")
async def root():
    return {
        "service": "Summon Experts Agent Service",
        "status": "running",
        "model": "llama3.2:3b (via Ollama)",
        "endpoints": ["/okr", "/market", "/strategy", "/roadmap"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081, reload=True)

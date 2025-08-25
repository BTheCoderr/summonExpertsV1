import { NextRequest } from "next/server"
import { 
  MultiAgentOrchestrator, 
  RoundRobinStrategy, 
  SelectorStrategy,
  TextTerminationCondition,
  TurnLimitCondition,
  CompositeTerminationCondition
} from "@/lib/agents/multi-agent-orchestrator"
import { AgentFactory } from "@/lib/agents/concrete-agents"

// Global orchestrator instances to maintain session state
const orchestrators = new Map<string, MultiAgentOrchestrator>()

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, teamType = "round-robin" } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Get or create orchestrator for this team type
    let orchestrator: MultiAgentOrchestrator
    let agents: any[]
    let sessionIdToUse = sessionId

    if (!orchestrators.has(teamType)) {
      if (teamType === "coordinated") {
        // For coordinated teams, we need the coordinator separately from the response agents
        const coordinator = AgentFactory.createCoordinator()
        agents = AgentFactory.createCoordinatedTeam() // This now returns only the response agents
        
        orchestrator = new MultiAgentOrchestrator(
          new SelectorStrategy(coordinator),
          [
            new CompositeTerminationCondition([
              new TextTerminationCondition(["PLAN_COMPLETE", "EXECUTION_COMPLETE", "WRITING_COMPLETE", "COORDINATION_COMPLETE"]),
              new TurnLimitCondition(8)
            ])
          ]
        )
      } else if (teamType === "research") {
        // Research-focused team
        agents = AgentFactory.createResearchTeam()
        orchestrator = new MultiAgentOrchestrator(
          new RoundRobinStrategy(),
          [
            new CompositeTerminationCondition([
              new TextTerminationCondition(["RESEARCH_COMPLETE", "PLAN_COMPLETE", "WRITING_COMPLETE"]),
              new TurnLimitCondition(6)
            ])
          ]
        )
      } else if (teamType === "creative") {
        // Creative team
        agents = AgentFactory.createCreativeTeam()
        orchestrator = new MultiAgentOrchestrator(
          new RoundRobinStrategy(),
          [
            new CompositeTerminationCondition([
              new TextTerminationCondition(["CREATIVE_COMPLETE", "PLAN_COMPLETE", "WRITING_COMPLETE"]),
              new TurnLimitCondition(6)
            ])
          ]
        )
      } else if (teamType === "innovation") {
        // Innovation team
        agents = AgentFactory.createInnovationTeam()
        orchestrator = new MultiAgentOrchestrator(
          new RoundRobinStrategy(),
          [
            new CompositeTerminationCondition([
              new TextTerminationCondition(["CREATIVE_COMPLETE", "RESEARCH_COMPLETE", "PLAN_COMPLETE", "EXECUTION_COMPLETE"]),
              new TurnLimitCondition(8)
            ])
          ]
        )
      } else {
        // Default round-robin team
        agents = AgentFactory.createDefaultTeam()
        orchestrator = new MultiAgentOrchestrator(
          new RoundRobinStrategy(),
          [
            new CompositeTerminationCondition([
              new TextTerminationCondition(["PLAN_COMPLETE", "EXECUTION_COMPLETE", "WRITING_COMPLETE"]),
              new TurnLimitCondition(6)
            ])
          ]
        )
      }
      orchestrators.set(teamType, orchestrator)
    } else {
      orchestrator = orchestrators.get(teamType)!
    }

    // Create session if needed
    if (!sessionIdToUse) {
      sessionIdToUse = await orchestrator.createSession(agents, 10)
    }
    
    // For coordinated teams, we need to ensure the coordinator has access to the agents
    if (teamType === "coordinated") {
      const session = orchestrator.getSession(sessionIdToUse)
      if (session) {
        console.log('Coordinated team session created with agents:', session.agents.map(a => a.name))
      }
    }

    // Verify session exists
    const existingSession = orchestrator.getSession(sessionIdToUse)
    if (!existingSession) {
      return new Response(JSON.stringify({ error: "Session not found or expired" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Process message and get streaming response
    const stream = await orchestrator.processMessage(sessionIdToUse, message)

    // Convert to ReadableStream for streaming response
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    // Process the stream
    ;(async () => {
      try {
        for await (const event of stream) {
          const data = JSON.stringify(event)
          await writer.write(encoder.encode(`data: ${data}\n\n`))
        }
        // Signal completion
        await writer.write(encoder.encode("event: done\ndata: {}\n\n"))
      } catch (error) {
        console.error("Stream processing error:", error)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: String(error) })}\n\n`))
      } finally {
        await writer.close()
      }
    })()

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Session-Id": sessionIdToUse,
        "X-Team-Type": teamType,
      },
    })

  } catch (error) {
    console.error("Error in agent orchestration route:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

// Add session cleanup endpoint
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    const teamType = searchParams.get('teamType') || 'round-robin'

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const orchestrator = orchestrators.get(teamType)
    if (!orchestrator) {
      return new Response(JSON.stringify({ error: "Team type not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      })
    }

    const deleted = orchestrator.deleteSession(sessionId)
    return new Response(JSON.stringify({ 
      success: deleted, 
      message: deleted ? "Session deleted" : "Session not found" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

  } catch (error) {
    console.error("Error in session cleanup:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

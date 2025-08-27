import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const USE_AGENTS = process.env.MULTIAGENT_OVERRIDE === "true"
const AGENT_HOST = process.env.AGENT_HOST ?? "http://localhost:5057"

export async function POST(req: NextRequest) {
  if (!USE_AGENTS) {
    return new Response(
      "Set MULTIAGENT_OVERRIDE=true to route /api/chat to the multi-agent service.",
      { status: 501 }
    )
  }

  const { sessionId, message } = await req.json()
  
  // Start session if needed
  let sid = sessionId as string | undefined
  if (!sid) {
    const r = await fetch(`${AGENT_HOST}/sessions`, { method: "POST" })
    if (!r.ok) {
      return new Response("Failed to start session", { status: 502 })
    }
    const j = await r.json()
    sid = j.sessionId
  }

  const upstream = await fetch(`${AGENT_HOST}/sessions/${sid}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  if (!upstream.ok) {
    return new Response("Agent service error", { status: upstream.status })
  }

  const { readable, writable } = new TransformStream()
  if (upstream.body) {
    upstream.body.pipeTo(writable).catch(console.error)
  }

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Session-Id": sid!,
    },
  })
}

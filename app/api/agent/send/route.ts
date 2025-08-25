import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const AGENT_HOST = process.env.AGENT_HOST ?? "http://localhost:5057"

export async function POST(req: NextRequest) {
  const { sessionId, message } = await req.json()

  let sid = sessionId as string | undefined
  if (!sid) {
    const r = await fetch(`${AGENT_HOST}/sessions`, { method: "POST" })
    if (!r.ok) return new Response("failed to start session", { status: 502 })
    const j = await r.json()
    sid = j.sessionId
  }

  const upstream = await fetch(`${AGENT_HOST}/sessions/${sid}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  const { readable, writable } = new TransformStream()
  if (!upstream.body) return new Response("no body", { status: 502 })
  upstream.body.pipeTo(writable)

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

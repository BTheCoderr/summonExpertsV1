import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const AGENT_HOST = process.env.AGENT_HOST ?? "http://localhost:5057"

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sid = searchParams.get("sid")
    const phase = searchParams.get("phase")
    
    if (!sid || !phase) {
      return new Response("Missing sid or phase parameter", { status: 400 })
    }
    
    const upstream = await fetch(`${AGENT_HOST}/plan/run?sid=${sid}&phase=${phase}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!upstream.ok) {
      return new Response(`Agent service error: ${upstream.status}`, { 
        status: upstream.status 
      })
    }
    
    if (!upstream.body) {
      return new Response("No response body from agent service", { status: 502 })
    }
    
    // Stream the response directly from the Python service
    const { readable, writable } = new TransformStream()
    upstream.body.pipeTo(writable).catch(console.error)
    
    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform", 
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    })
    
  } catch (error) {
    console.error("Plan run error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}

import { NextRequest } from "next/server"

const AGENT_HOST = process.env.AGENT_HOST ?? "http://localhost:5057"

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sid = searchParams.get("sid")
    
    if (!sid) {
      return new Response("sid parameter required", { status: 400 })
    }
    
    const response = await fetch(`${AGENT_HOST}/plan/save?sid=${sid}`, {
      method: "POST"
    })
    
    const data = await response.json()
    return Response.json(data, { status: response.status })
    
  } catch (error) {
    console.error("Plan save error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

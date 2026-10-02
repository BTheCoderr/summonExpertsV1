const AGENT_HOST = process.env.AGENT_HOST ?? "http://localhost:5057"

export async function GET() {
  try {
    const response = await fetch(`${AGENT_HOST}/plan/list`, {
      cache: 'no-store'
    })
    
    const data = await response.json()
    return Response.json(data, { status: response.status })
    
  } catch (error) {
    console.error("Plan list error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

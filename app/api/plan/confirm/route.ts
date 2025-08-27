import { NextRequest, NextResponse } from "next/server"

const AGENT_HOST = process.env.AGENT_HOST ?? "http://localhost:5057"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const response = await fetch(`${AGENT_HOST}/plan/confirm`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to confirm phase", status: response.status },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("Plan confirm error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

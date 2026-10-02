import { NextRequest, NextResponse } from "next/server";
import { analyzeMarket } from "@/lib/ai/strategic-planning-agents";

// In-memory storage (replace with your database)
const plans = new Map<string, any>();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { refresh = false } = await req.json();
    const planId = params.id;

    // Get the plan (in real app, fetch from database)
    const plan = plans.get(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check if OKRs are approved
    if (plan.status !== "okr_approved") {
      return NextResponse.json(
        { error: "OKRs must be approved before market analysis" },
        { status: 400 }
      );
    }

    try {
      console.log("[Market Analyst] Starting market analysis for plan:", planId);
      
      // Run market analysis using the Market Analyst Agent
      const marketAnalysis = await analyzeMarket(plan.inputs);
      
      // Update plan with market analysis
      plan.market = marketAnalysis;
      plan.status = "market_ready";
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "system",
        event: "market_analysis_completed",
        payload: { market: marketAnalysis }
      });

      // Update timestamp
      plan.updatedAt = new Date().toISOString();
      
      // Store updated plan
      plans.set(planId, plan);

      console.log("[Market Analyst] Market analysis completed successfully", { 
        opportunities: marketAnalysis.growthOpportunities.length 
      });

      return NextResponse.json({ 
        plan,
        message: "Market analysis completed successfully"
      });

    } catch (error) {
      console.error("[Market Analyst] Error during market analysis:", error);
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "system",
        event: "market_analysis_failed",
        payload: { error: error instanceof Error ? error.message : "Unknown error" }
      });

      return NextResponse.json(
        { error: "Market analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing market analysis request:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

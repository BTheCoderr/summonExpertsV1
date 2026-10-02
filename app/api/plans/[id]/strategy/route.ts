import { NextRequest, NextResponse } from "next/server";
import { createStrategy, reviewStrategy } from "@/lib/ai/strategic-planning-agents";

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

    // Check if market opportunities are selected
    if (plan.status !== "market_ready" || !plan.market?.selectedOpportunityIds) {
      return NextResponse.json(
        { error: "Market opportunities must be selected before strategy development" },
        { status: 400 }
      );
    }

    try {
      console.log("[Strategy Agent] Starting strategy development for plan:", planId);
      
      // Create initial strategy using the Strategy Agent
      const initialStrategy = await createStrategy(
        plan.okr,
        plan.market.selectedOpportunityIds,
        plan.inputs
      );
      
      console.log("[Strategy Agent] Initial strategy created", { 
        initiatives: initialStrategy.initiatives.length,
        lineOfAction: initialStrategy.lineOfAction.length
      });

      // Review and refine strategy using the Business Coach Agent
      console.log("[Business Coach] Reviewing strategy for feasibility and alignment");
      const reviewedStrategy = await reviewStrategy(initialStrategy, plan.okr, plan.inputs);
      
      // Update plan with reviewed strategy
      plan.strategy = reviewedStrategy;
      plan.status = "strategy_draft";
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "system",
        event: "strategy_developed",
        payload: { 
          strategy: reviewedStrategy,
          initiatives: reviewedStrategy.initiatives.length,
          totalEffort: reviewedStrategy.initiatives.reduce((sum: number, init: any) => sum + (init.effortHrs || 0), 0)
        }
      });

      // Update timestamp
      plan.updatedAt = new Date().toISOString();
      
      // Store updated plan
      plans.set(planId, plan);

      console.log("[Business Coach] Strategy review completed successfully", { 
        initiatives: reviewedStrategy.initiatives.length,
        feasibilityNotes: reviewedStrategy.feasibilityNotes ? "Yes" : "No"
      });

      return NextResponse.json({ 
        plan,
        message: "Strategy developed and reviewed successfully"
      });

    } catch (error) {
      console.error("[Strategy Development] Error during strategy development:", error);
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "system",
        event: "strategy_development_failed",
        payload: { error: error instanceof Error ? error.message : "Unknown error" }
      });

      return NextResponse.json(
        { error: "Strategy development failed", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing strategy development request:", error);
    
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

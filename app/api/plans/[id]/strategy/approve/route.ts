import { NextRequest, NextResponse } from "next/server";
import { StrategyApprovalRequest } from "@/lib/schemas/strategic-planning";

// In-memory storage (replace with your database)
const plans = new Map<string, any>();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved, changeRequest } = StrategyApprovalRequest.parse(await req.json());
    const planId = params.id;

    // Get the plan (in real app, fetch from database)
    const plan = plans.get(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check if strategy is in draft status
    if (plan.status !== "strategy_draft") {
      return NextResponse.json(
        { error: "Strategy must be in draft status for approval" },
        { status: 400 }
      );
    }

    if (!approved && changeRequest) {
      // Strategy not approved - add change request to history
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "user",
        event: "strategy_change_requested",
        payload: { changeRequest }
      });

      console.log("[Strategy Approval] Change request recorded", { 
        planId,
        changeRequest 
      });

      return NextResponse.json({ 
        plan,
        message: "Change request recorded. Strategy remains in draft status."
      });
    } else if (approved) {
      // Strategy approved - update status
      plan.status = "strategy_approved";
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "user",
        event: "strategy_approved",
        payload: { strategy: plan.strategy }
      });

      // Update timestamp
      plan.updatedAt = new Date().toISOString();
      
      // Store updated plan
      plans.set(planId, plan);

      console.log("[Strategy Approval] Strategy approved successfully", { 
        planId,
        initiatives: plan.strategy.initiatives.length
      });

      return NextResponse.json({ 
        plan,
        message: "Strategy approved successfully"
      });
    } else {
      // No change request provided for rejection
      return NextResponse.json(
        { error: "Change request is required when rejecting strategy" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error processing strategy approval:", error);
    
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

import { NextRequest, NextResponse } from "next/server";
import { MarketSelectionRequest } from "@/lib/schemas/strategic-planning";

// In-memory storage (replace with your database)
const plans = new Map<string, any>();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { selectedOpportunityIds } = MarketSelectionRequest.parse(await req.json());
    const planId = params.id;

    // Get the plan (in real app, fetch from database)
    const plan = plans.get(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check if market analysis is complete
    if (plan.status !== "market_ready") {
      return NextResponse.json(
        { error: "Market analysis must be completed before selecting opportunities" },
        { status: 400 }
      );
    }

    // Validate that selected opportunities exist in the market analysis
    const availableOpportunityIds = plan.market.growthOpportunities.map((opp: any) => opp.id);
    const invalidSelections = selectedOpportunityIds.filter(id => !availableOpportunityIds.includes(id));
    
    if (invalidSelections.length > 0) {
      return NextResponse.json(
        { error: "Invalid opportunity IDs selected", invalidIds: invalidSelections },
        { status: 400 }
      );
    }

    // Update plan with selected opportunities
    plan.market.selectedOpportunityIds = selectedOpportunityIds;
    
    plan.history.push({
      ts: new Date().toISOString(),
      actor: "user",
      event: "opportunities_selected",
      payload: { 
        selectedOpportunityIds,
        totalSelected: selectedOpportunityIds.length 
      }
    });

    // Update timestamp
    plan.updatedAt = new Date().toISOString();
    
    // Store updated plan
    plans.set(planId, plan);

    console.log("[Market Selection] Opportunities selected successfully", { 
      planId,
      selectedCount: selectedOpportunityIds.length,
      selectedIds: selectedOpportunityIds
    });

    return NextResponse.json({ 
      plan,
      message: `Successfully selected ${selectedOpportunityIds.length} growth opportunities`
    });

  } catch (error) {
    console.error("Error processing opportunity selection:", error);
    
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

import { NextRequest, NextResponse } from "next/server";
import { 
  CreatePlanRequest, 
  GrowthPlanDoc, 
  PlanStatus,
  CreatePlanRequestType,
  GrowthPlanDocType 
} from "@/lib/schemas/strategic-planning";
import { draftOKRs, reviewOKRs } from "@/lib/ai/strategic-planning-agents";

// In-memory storage for demo (replace with your database)
const plans = new Map<string, GrowthPlanDocType>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { autoDraftOkrs = true, ...planInputs } = CreatePlanRequest.parse(body);

    // Generate unique plan ID
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create base plan document
    const plan: GrowthPlanDocType = {
      id: planId,
      userId: "user-123", // Replace with actual user auth
      inputs: planInputs,
      status: "inputs_collected",
      version: 1,
      history: [
        {
          ts: new Date().toISOString(),
          actor: "system",
          event: "plan_created",
          payload: { inputs: planInputs }
        }
      ],
      title: `Strategic Plan for ${planInputs.startDate} – ${planInputs.endDate}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto-draft OKRs if requested
    if (autoDraftOkrs) {
      try {
        console.log("[OKR Planner] Processing OKR planning request", {
          message: `Create OKRs for a balanced growth plan with these inputs: ${JSON.stringify(planInputs)}`
        });

        // Draft initial OKRs
        const draftOKR = await draftOKRs(planInputs, "balanced");
        
        // Review and refine OKRs
        const refinedOKR = await reviewOKRs(draftOKR, planInputs);
        
        plan.okr = refinedOKR;
        plan.status = "okr_draft";
        
        plan.history.push({
          ts: new Date().toISOString(),
          actor: "system",
          event: "okr_drafted",
          payload: { okr: refinedOKR }
        });

        console.log("[OKR Planner] OKR generated successfully", { okr: refinedOKR });
      } catch (error) {
        console.error("[OKR Planner] Error generating OKRs:", error);
        // Continue without OKRs - user can generate them later
        plan.history.push({
          ts: new Date().toISOString(),
          actor: "system",
          event: "okr_generation_failed",
          payload: { error: error instanceof Error ? error.message : "Unknown error" }
        });
      }
    }

    // Store the plan
    plans.set(planId, plan);
    
    console.log("Plan created:", plan);

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-123";
    
    // Get current plan for user
    const userPlans = Array.from(plans.values())
      .filter(plan => plan.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    const currentPlan = userPlans[0];
    
    return NextResponse.json({ 
      plan: currentPlan,
      totalPlans: userPlans.length 
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

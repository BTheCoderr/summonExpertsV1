import { NextRequest, NextResponse } from "next/server";
import { 
  ApproveOKRRequest, 
  ApproveOKRRequestType 
} from "@/lib/schemas/strategic-planning";
import { draftOKRs, reviewOKRs } from "@/lib/ai/strategic-planning-agents";

// In-memory storage (replace with your database)
const plans = new Map<string, any>();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved, regenerateFocus = "balanced" } = ApproveOKRRequest.parse(await req.json());
    const planId = params.id;

    // Get the plan (in real app, fetch from database)
    const plan = plans.get(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    if (!approved) {
      // Regenerate OKRs with new focus
      try {
        console.log(`[OKR Planner] Regenerating OKRs with focus: ${regenerateFocus}`);
        
        // Draft new OKRs with specified focus
        const draftOKR = await draftOKRs(plan.inputs, regenerateFocus);
        
        // Review and refine the new OKRs
        const refinedOKR = await reviewOKRs(draftOKR, plan.inputs);
        
        plan.okr = refinedOKR;
        plan.status = "okr_draft";
        
        plan.history.push({
          ts: new Date().toISOString(),
          actor: "user",
          event: "okr_regenerated",
          payload: { focus: regenerateFocus, okr: refinedOKR }
        });

        console.log("[OKR Planner] OKRs regenerated successfully", { 
          focus: regenerateFocus, 
          okr: refinedOKR 
        });
      } catch (error) {
        console.error("[OKR Planner] Error regenerating OKRs:", error);
        return NextResponse.json(
          { error: "Failed to regenerate OKRs", details: error instanceof Error ? error.message : "Unknown error" },
          { status: 500 }
        );
      }
    } else {
      // Approve current OKRs
      plan.status = "okr_approved";
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "user",
        event: "okr_approved",
        payload: { okr: plan.okr }
      });

      console.log("[OKR Planner] OKRs approved successfully");
    }

    // Update timestamp
    plan.updatedAt = new Date().toISOString();
    
    // Store updated plan
    plans.set(planId, plan);

    return NextResponse.json({ 
      plan,
      message: approved ? "OKRs approved successfully" : "OKRs regenerated successfully"
    });

  } catch (error) {
    console.error("Error processing OKR approval:", error);
    
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

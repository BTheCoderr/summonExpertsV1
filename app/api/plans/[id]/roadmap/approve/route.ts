import { NextRequest, NextResponse } from "next/server";
import { RoadmapApprovalRequest } from "@/lib/schemas/strategic-planning";

// In-memory storage (replace with your database)
const plans = new Map<string, any>();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved } = RoadmapApprovalRequest.parse(await req.json());
    const planId = params.id;

    // Get the plan (in real app, fetch from database)
    const plan = plans.get(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check if roadmap is in draft status
    if (plan.status !== "roadmap_draft") {
      return NextResponse.json(
        { error: "Roadmap must be in draft status for approval" },
        { status: 400 }
      );
    }

    if (approved) {
      // Roadmap approved - complete the strategic plan
      plan.status = "complete";
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "user",
        event: "roadmap_approved",
        payload: { 
          roadmap: plan.roadmap,
          totalInitiatives: plan.roadmap.length,
          completionDate: new Date().toISOString()
        }
      });

      // Update timestamp
      plan.updatedAt = new Date().toISOString();
      
      // Store updated plan
      plans.set(planId, plan);

      console.log("[Roadmap Approval] Strategic plan completed successfully", { 
        planId,
        totalInitiatives: plan.roadmap.length,
        completionDate: new Date().toISOString()
      });

      return NextResponse.json({ 
        plan,
        message: "Strategic plan completed successfully! 🎉"
      });
    } else {
      // Roadmap not approved - keep in draft status
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "user",
        event: "roadmap_rejected",
        payload: { 
          roadmap: plan.roadmap,
          reason: "User requested changes"
        }
      });

      console.log("[Roadmap Approval] Roadmap rejected, remains in draft status", { 
        planId 
      });

      return NextResponse.json({ 
        plan,
        message: "Roadmap rejected. You can regenerate or modify as needed."
      });
    }

  } catch (error) {
    console.error("Error processing roadmap approval:", error);
    
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

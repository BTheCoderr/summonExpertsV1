import { NextRequest, NextResponse } from "next/server";
import { buildRoadmap } from "@/lib/ai/strategic-planning-agents";

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

    // Check if strategy is approved
    if (plan.status !== "strategy_approved") {
      return NextResponse.json(
        { error: "Strategy must be approved before roadmap generation" },
        { status: 400 }
      );
    }

    try {
      console.log("[Project Manager] Starting roadmap generation for plan:", planId);
      
      // Generate roadmap using the Project Manager Agent
      const roadmapRows = await buildRoadmap(plan.strategy, plan.okr, plan.inputs);
      
      // Update plan with roadmap
      plan.roadmap = roadmapRows;
      plan.status = "roadmap_draft";
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "system",
        event: "roadmap_generated",
        payload: { 
          roadmap: roadmapRows,
          totalRows: roadmapRows.length,
          timeline: {
            start: roadmapRows[0]?.start,
            end: roadmapRows[roadmapRows.length - 1]?.end
          }
        }
      });

      // Update timestamp
      plan.updatedAt = new Date().toISOString();
      
      // Store updated plan
      plans.set(planId, plan);

      console.log("[Project Manager] Roadmap generated successfully", { 
        totalRows: roadmapRows.length,
        timeline: {
          start: roadmapRows[0]?.start,
          end: roadmapRows[roadmapRows.length - 1]?.end
        }
      });

      return NextResponse.json({ 
        plan,
        message: "Roadmap generated successfully"
      });

    } catch (error) {
      console.error("[Project Manager] Error during roadmap generation:", error);
      
      plan.history.push({
        ts: new Date().toISOString(),
        actor: "system",
        event: "roadmap_generation_failed",
        payload: { error: error instanceof Error ? error.message : "Unknown error" }
      });

      return NextResponse.json(
        { error: "Roadmap generation failed", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing roadmap generation request:", error);
    
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

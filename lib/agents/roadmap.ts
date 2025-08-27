import { TRoadmapRow, RoadmapRow, TStrategyPlan, TOKRBlock, TPlanInputs } from "../schemas";
import { callModel } from "../ai-enhanced";

export async function buildRoadmap(strategy: TStrategyPlan, okr: TOKRBlock, inputs: TPlanInputs): Promise<TRoadmapRow[]> {
  const system = "You are a project scheduler. Convert initiatives into a 90-day roadmap. Return a JSON array of roadmap items with this structure: [{\"initiativeId\": \"init-1\", \"initiative\": \"string\", \"start\": \"2024-01-01T00:00:00.000Z\", \"end\": \"2024-01-14T00:00:00.000Z\", \"dependencies\": [\"init-0\"], \"metric\": \"Revenue\"}]. Use ISO date strings and respect dependencies.";
  
  const user = `Create a 90-day roadmap for these initiatives:

Initiatives (in priority order):
${strategy.initiatives.map(i => `${i.id}: ${i.title} - ${i.description} (Priority: ${i.priority}, Depends on: ${i.dependsOn.join(', ') || 'None'})`).join('\n')}

Line of Action: ${strategy.lineOfAction.join(' → ')}

Timeline: ${inputs.startDate} to ${inputs.endDate}
Availability: ${inputs.availabilityHrsPerWeek} hours/week

Key Results for Metrics:
${okr.keyResults.map(kr => `${kr.id}: ${kr.metric}`).join('\n')}

Create a realistic schedule that:
1. Respects dependencies between initiatives
2. Considers the part-time availability
3. Maps each initiative to relevant metrics from the key results
4. Spreads work evenly across the 90-day period

Return only a JSON array in the specified format.`;

  const out = await callModel({ 
    system, 
    user, 
    agentType: "roadmap" 
  });
  
  let parsed: unknown;
  try { 
    parsed = JSON.parse(out); 
  } catch { 
    console.error("Failed to parse roadmap response:", out);
    parsed = [];
  }
  
  const normalize = Array.isArray(parsed) ? parsed : [];
  const rows = [] as TRoadmapRow[];
  
  for (const r of normalize) {
    const ok = RoadmapRow.safeParse(r);
    if (ok.success) rows.push(ok.data);
  }
  
  if (rows.length) return rows;
  
  // fallback simple schedule
  const start = new Date(inputs.startDate);
  function days(n: number) { 
    return new Date(start.getTime() + n * 24 * 3600 * 1000).toISOString(); 
  }
  
  return strategy.lineOfAction.map((id, idx) => {
    const init = strategy.initiatives.find(i => i.id === id)!;
    const s = idx === 0 ? days(0) : days(idx * 14);
    const e = days((idx + 1) * 21);
    const metric = okr.keyResults.find(kr => init.mappedKRs.includes(kr.id))?.metric || "Milestone";
    return { 
      initiativeId: id, 
      initiative: init.title, 
      start: s, 
      end: e, 
      dependencies: init.dependsOn, 
      metric 
    };
  });
}

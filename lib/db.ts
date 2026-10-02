// Minimal in-memory store for demo. Replace with Supabase or Prisma.
import { TGrowthPlanDoc } from "./schemas";

const store = new Map<string, TGrowthPlanDoc>();

export function savePlan(doc: TGrowthPlanDoc) {
  store.set(doc.id, doc);
}

export function getPlan(id: string) {
  return store.get(id) || null;
}

export function getCurrentPlan(userId: string) {
  const all = Array.from(store.values()).filter((p) => p.userId === userId);
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] || null;
}

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Planner → create milestones + tasks
export async function dbUpsertPlan(args: {
  project_id: string;
  milestones: { title: string; due_date?: string; order_index: number }[];
  tasks: {
    title: string;
    details?: string;
    milestone_title?: string;
    owner_agent_key?: string;
    priority?: number;
    due_in_days?: number;
  }[];
}) {
  // Insert milestones
  const { data: milestones, error: milestoneErr } = await supabase
    .from("milestones")
    .insert(args.milestones.map(m => ({ ...m, project_id: args.project_id })))
    .select("id,title");

  if (milestoneErr) throw milestoneErr;

  // Insert tasks
  const { data: tasks, error: taskErr } = await supabase
    .from("tasks")
    .insert(
      args.tasks.map(t => ({
        ...t,
        project_id: args.project_id,
        due_at: t.due_in_days
          ? new Date(Date.now() + t.due_in_days * 86400000).toISOString()
          : null,
      }))
    )
    .select("id,title");

  if (taskErr) throw taskErr;

  return { milestone_ids: milestones?.map(m => m.id), task_ids: tasks?.map(t => t.id) };
}

// Tracker → log task event
export async function dbTaskEvent(args: {
  task_id: string;
  type: "created" | "started" | "blocked" | "unblocked" | "completed" | "comment" | "nudge_sent";
  payload?: any;
}) {
  const { error } = await supabase.from("task_events").insert({
    task_id: args.task_id,
    type: args.type,
    payload: args.payload,
  });
  if (error) throw error;
  return { ok: true };
}

// Get project tasks for tracking
export async function dbGetProjectTasks(project_id: string) {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      *,
      milestone:milestones(title),
      events:task_events(type, created_at, payload)
    `)
    .eq("project_id", project_id)
    .order("due_at", { ascending: true });

  if (error) throw error;
  return { tasks };
}

// Update task status
export async function dbUpdateTaskStatus(task_id: string, status: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", task_id);

  if (error) throw error;
  return { ok: true };
}

// Create project
export async function dbCreateProject(args: {
  org_id: string;
  title: string;
  description?: string;
  created_by: string;
}) {
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      org_id: args.org_id,
      title: args.title,
      description: args.description,
      created_by: args.created_by,
    })
    .select("id, title")
    .single();

  if (error) throw error;
  return { project_id: project.id, title: project.title };
}

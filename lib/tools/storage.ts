import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Save agent deliverable (doc, csv, etc.)
export async function storageSaveDoc(args: {
  project_id: string;
  task_id?: string;
  filename: string;
  content_md?: string;
  content_json?: any;
}) {
  const bucket = "outputs";
  const filePath = `${args.project_id}/${args.filename}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, args.content_md ?? JSON.stringify(args.content_json), {
      upsert: true,
    });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  // Log output row
  await supabase.from("outputs").insert({
    project_id: args.project_id,
    task_id: args.task_id,
    kind: args.content_md ? "doc" : "json",
    url: data.publicUrl,
    summary: args.filename,
  });

  return { url: data.publicUrl };
}

// Get project outputs
export async function getProjectOutputs(project_id: string) {
  const { data: outputs, error } = await supabase
    .from("outputs")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { outputs };
}

// Save task deliverable
export async function saveTaskDeliverable(args: {
  task_id: string;
  project_id: string;
  filename: string;
  content: string;
  kind: "doc" | "csv" | "json" | "link";
}) {
  const bucket = "task-outputs";
  const filePath = `${args.project_id}/${args.task_id}/${args.filename}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, args.content, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  // Log output row
  await supabase.from("outputs").insert({
    project_id: args.project_id,
    task_id: args.task_id,
    kind: args.kind,
    url: data.publicUrl,
    summary: args.filename,
  });

  return { url: data.publicUrl };
}

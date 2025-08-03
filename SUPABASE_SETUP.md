# Supabase Setup for Multi-Agent Infrastructure

## Database Schema Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create tasks table
create table if not exists tasks (
  id text primary key,
  user_input text not null,
  enable_forking boolean default false,
  created_at timestamp default now()
);

-- Create agent_outputs table
create table if not exists agent_outputs (
  id serial primary key,
  task_id text references tasks(id) on delete cascade,
  agent_role text not null,
  input text not null,
  output text not null,
  cost_tokens integer,
  retry_count integer default 0,
  created_at timestamp default now()
);

-- Create indexes for better performance
create index if not exists idx_tasks_created_at on tasks(created_at);
create index if not exists idx_agent_outputs_task_id on agent_outputs(task_id);
create index if not exists idx_agent_outputs_role on agent_outputs(agent_role);

-- Enable Row Level Security (RLS)
alter table tasks enable row level security;
alter table agent_outputs enable row level security;

-- Create policies (adjust based on your auth requirements)
create policy "Allow all operations on tasks" on tasks for all using (true);
create policy "Allow all operations on agent_outputs" on agent_outputs for all using (true);
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Getting Your Supabase Keys

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## Testing the Setup

1. Start your development server: `npm run dev`
2. Visit `/mvp` to test the multi-agent infrastructure
3. Check your Supabase dashboard to see the data being logged

## Database Schema Overview

### Tasks Table
- `id`: Unique task identifier
- `user_input`: The original user request
- `enable_forking`: Whether agent forking was enabled
- `created_at`: Timestamp of task creation

### Agent Outputs Table
- `id`: Auto-incrementing primary key
- `task_id`: Foreign key to tasks table
- `agent_role`: Which agent (researcher, summarizer, validator)
- `input`: Input provided to the agent
- `output`: Agent's response
- `cost_tokens`: Token usage for cost tracking
- `retry_count`: Number of retries if agent failed
- `created_at`: Timestamp of agent execution

## Features Enabled

✅ **Multi-Agent Pipeline**: Researcher → Summarizer → Validator
✅ **Retry Logic**: Automatic retry on failures (max 3 attempts)
✅ **Agent Forking**: Run multiple instances for better results
✅ **Output Selection**: AI-powered selection of best output
✅ **Cost Tracking**: Token usage logging
✅ **Audit Trail**: Complete history of all agent operations 
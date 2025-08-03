import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client with fallback
let supabase: any = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch (error) {
    console.warn('Supabase initialization failed:', error);
  }
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-sonnet-20240229';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAgent(role: string, input: string, taskId: string, retryCount = 0): Promise<string> {
  const systemPrompts = {
    researcher: 'You are a research assistant. Investigate the task in depth and return key insights.',
    summarizer: 'You are a summarizer. Condense input into an actionable 3-step summary.',
    validator: 'You are a validator. Cross-check the logic and flag issues.',
  }[role];

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 800,
    temperature: 0.7,
    system: systemPrompts,
    messages: [
      { role: 'user', content: input }
    ]
  };

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const output = data?.content?.[0]?.text || '[No output]';

    // Validate output quality
    if (output.length < 10) {
      throw new Error('Output too short, likely failed');
    }

    // Log to Supabase if available
    if (supabase) {
      try {
        await supabase.from('agent_outputs').insert({
          task_id: taskId,
          agent_role: role,
          input,
          output,
          cost_tokens: data?.usage?.output_tokens || null,
          retry_count: retryCount
        });
      } catch (dbError) {
        console.warn('Failed to log to Supabase:', dbError);
      }
    }

    return output;
  } catch (error) {
    console.error(`Agent ${role} failed (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ${role} in ${RETRY_DELAY}ms...`);
      await delay(RETRY_DELAY);
      return runAgent(role, input, taskId, retryCount + 1);
    }
    
    return `[Error after ${MAX_RETRIES} retries: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

// Agent forking - run multiple instances of the same agent type
async function runAgentFork(role: string, input: string, taskId: string, forkCount = 2): Promise<string[]> {
  const promises = Array.from({ length: forkCount }, (_, i) => 
    runAgent(role, input, taskId).then(output => ({ output, index: i }))
  );
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, i) => {
    if (result.status === 'fulfilled') {
      return result.value.output;
    } else {
      return `[Fork ${i + 1} failed: ${result.reason}]`;
    }
  });
}

// Agent selector - choose the best output from multiple forks
async function selectBestOutput(outputs: string[], taskId: string): Promise<string> {
  if (outputs.length === 1) return outputs[0];
  
  const selectorPrompt = `You are an output selector. Choose the best response from the following options. Consider:
1. Completeness and relevance
2. Clarity and actionable insights
3. Logical flow and structure

Options:
${outputs.map((output, i) => `${i + 1}. ${output.substring(0, 200)}...`).join('\n')}

Return only the number (1-${outputs.length}) of the best option.`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 10,
        temperature: 0.1,
        system: 'You are an output selector. Return only a number.',
        messages: [{ role: 'user', content: selectorPrompt }]
      })
    });

    const data = await response.json();
    const selection = data?.content?.[0]?.text?.trim();
    const index = parseInt(selection) - 1;
    
    if (index >= 0 && index < outputs.length) {
      return outputs[index];
    }
    
    // Fallback to first output if selection fails
    return outputs[0];
  } catch (error) {
    console.error('Output selection failed:', error);
    return outputs[0]; // Fallback to first output
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_input, enable_forking = false } = await request.json();
    const taskId = randomUUID();

    // Log task to Supabase if available
    if (supabase) {
      try {
        await supabase.from('tasks').insert({ 
          id: taskId, 
          user_input,
          enable_forking 
        });
      } catch (dbError) {
        console.warn('Failed to log task to Supabase:', dbError);
      }
    }

    let researcherOut: string;
    let summarizerOut: string;
    let validatorOut: string;

    if (enable_forking) {
      // Run with forking for better results
      const researcherForks = await runAgentFork('researcher', user_input, taskId, 2);
      researcherOut = await selectBestOutput(researcherForks, taskId);
      
      const summarizerForks = await runAgentFork('summarizer', researcherOut, taskId, 2);
      summarizerOut = await selectBestOutput(summarizerForks, taskId);
      
      const validatorForks = await runAgentFork('validator', summarizerOut, taskId, 2);
      validatorOut = await selectBestOutput(validatorForks, taskId);
    } else {
      // Standard sequential pipeline
      researcherOut = await runAgent('researcher', user_input, taskId);
      summarizerOut = await runAgent('summarizer', researcherOut, taskId);
      validatorOut = await runAgent('validator', summarizerOut, taskId);
    }

    return NextResponse.json({ 
      taskId, 
      researcherOut, 
      summarizerOut, 
      validatorOut,
      success: true,
      forking_enabled: enable_forking,
      supabase_connected: !!supabase
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'MVP Orchestrator ready',
    description: '3-agent pipeline with retry logic and forking capabilities',
    supabase_connected: !!supabase,
    features: [
      'Researcher → Summarizer → Validator pipeline',
      'Automatic retry on failures (max 3 attempts)',
      'Agent forking for better results (optional)',
      'Output selection from multiple forks',
      'Supabase logging for all operations (if configured)'
    ]
  });
} 
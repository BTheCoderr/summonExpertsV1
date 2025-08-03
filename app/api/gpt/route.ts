import { NextRequest, NextResponse } from 'next/server';

let openai: any = null;

// Only initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require('openai').default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.warn('OpenAI initialization failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json({ 
        success: false, 
        error: 'OpenAI API not configured. Please set OPENAI_API_KEY environment variable.' 
      }, { status: 503 });
    }

    const { prompt, system, model = 'gpt-4o', maxTokens = 4000, temperature = 0.7 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'system',
          content: system || 'You are a helpful AI assistant for business planning and analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return NextResponse.json({
      success: true,
      data: {
        content: completion.choices[0].message.content,
        usage: completion.usage,
        model: completion.model,
        id: completion.id
      }
    });
  } catch (error) {
    console.error('GPT API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: openai ? 'GPT API ready' : 'GPT API not configured' 
  });
} 
import { NextRequest, NextResponse } from 'next/server';

let anthropic: any = null;

// Only initialize Anthropic if API key is available
if (process.env.ANTHROPIC_API_KEY) {
  try {
    const Anthropic = require('@anthropic-ai/sdk').default;
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  } catch (error) {
    console.warn('Anthropic initialization failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!anthropic) {
      return NextResponse.json({ 
        success: false, 
        error: 'Claude API not configured. Please set ANTHROPIC_API_KEY environment variable.' 
      }, { status: 503 });
    }

    const { prompt, system, model = 'claude-3-sonnet-20240229', maxTokens = 4000 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: system || 'You are a helpful AI assistant for business planning and analysis.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return NextResponse.json({
      success: true,
      data: {
        content: message.content[0].type === 'text' ? message.content[0].text : JSON.stringify(message.content[0]),
        usage: message.usage,
        model: message.model,
        id: message.id
      }
    });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: anthropic ? 'Claude API ready' : 'Claude API not configured' 
  });
} 
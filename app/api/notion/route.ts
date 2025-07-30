/**
 * Notion API endpoint
 * Handles reading from and writing to Notion pages
 * Integrates with actual Notion API for real functionality
 */

import { notionService } from '@/lib/notion'

export async function POST(req: Request) {
  try {
    const { action, content, pageId, prompt } = await req.json();
    
    // Validate input
    if (!action || typeof action !== 'string') {
      return Response.json(
        { error: 'Invalid action provided' },
        { status: 400 }
      );
    }

    if (!pageId) {
      return Response.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    let result;
    
    switch (action) {
      case 'read':
        try {
          const pageContent = await notionService.getPageTextContent(pageId);
          result = pageContent || 'No content found on this page';
        } catch (error) {
          result = `Error reading page: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        break;
        
      case 'write':
        try {
          await notionService.writeToPage(pageId, content || '');
          result = `Content successfully written to Notion page`;
        } catch (error) {
          result = `Error writing to page: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        break;
        
      case 'create-ai-block':
        try {
          if (!prompt) {
            throw new Error('Prompt is required for AI block creation');
          }
          await notionService.createAIBlock(pageId, content || 'AI response', prompt);
          result = `AI block successfully created in Notion`;
        } catch (error) {
          result = `Error creating AI block: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        break;
        
      case 'summarize':
        try {
          const pageContent = await notionService.getPageTextContent(pageId);
          result = `Summary of page content: ${pageContent.substring(0, 200)}...`;
        } catch (error) {
          result = `Error summarizing page: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        break;
        
      default:
        result = `Unknown action: ${action}`;
    }
    
    return Response.json({
      result,
      timestamp: new Date().toISOString(),
      action,
      pageId
    });

  } catch (error) {
    console.error('Notion API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
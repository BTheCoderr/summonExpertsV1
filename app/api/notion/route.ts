/**
 * Notion API endpoint
 * Handles reading from and writing to Notion pages
 * Integrates with actual Notion API for real functionality
 */

import { NextRequest, NextResponse } from 'next/server';

let notion: any = null;

// Only initialize Notion if API key is available
if (process.env.NOTION_SECRET) {
  try {
    const { Client } = require('@notionhq/client');
    notion = new Client({
      auth: process.env.NOTION_SECRET,
    });
  } catch (error) {
    console.warn('Notion initialization failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!notion) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notion API not configured. Please set NOTION_SECRET environment variable.' 
      }, { status: 503 });
    }

    const { action, parameters } = await request.json();
    
    switch (action) {
      case 'read_page':
        const page = await notion.pages.retrieve({ page_id: parameters.pageId });
        return NextResponse.json({ success: true, data: page });
        
      case 'search_pages':
        const searchResults = await notion.search({
          query: parameters.query,
          filter: { property: 'object', value: 'page' }
        });
        return NextResponse.json({ success: true, data: searchResults });
        
      case 'create_page':
        const newPage = await notion.pages.create({
          parent: { database_id: parameters.databaseId },
          properties: parameters.properties
        });
        return NextResponse.json({ success: true, data: newPage });
        
      case 'update_page':
        const updatedPage = await notion.pages.update({
          page_id: parameters.pageId,
          properties: parameters.properties
        });
        return NextResponse.json({ success: true, data: updatedPage });
        
      case 'query_database':
        const database = await notion.databases.query({
          database_id: parameters.databaseId,
          filter: parameters.filter
        });
        return NextResponse.json({ success: true, data: database });
        
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: notion ? 'Notion API ready' : 'Notion API not configured' 
  });
} 
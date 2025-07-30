# 🚀 Notion AI Integration Setup Guide

## Overview
This guide will help you set up the Notion AI integration to connect your AI workspace with real Notion pages and databases.

## Prerequisites
- A Notion account
- A Notion integration (we'll create this)
- Access to your Notion workspace

## Step 1: Create a Notion Integration

1. **Go to Notion Integrations**
   - Visit: https://www.notion.so/my-integrations
   - Click "New integration"

2. **Configure Your Integration**
   - **Name**: `AI Workspace Integration` (or your preferred name)
   - **Associated workspace**: Select your workspace
   - **Capabilities**: Enable all read/write permissions
   - Click "Submit"

3. **Copy Your Integration Token**
   - After creation, copy the "Internal Integration Token"
   - This will look like: `secret_abc123...`
   - **Keep this secure!**

## Step 2: Share Pages with Your Integration

1. **Open a Notion page** you want to integrate with
2. **Click "Share"** in the top right
3. **Click "Invite"** and search for your integration name
4. **Select your integration** and click "Invite"
5. **Repeat** for any pages you want to access

## Step 3: Get Page IDs

1. **Open a Notion page** in your browser
2. **Copy the URL** - it will look like:
   ```
   https://www.notion.so/Your-Page-Title-1234567890abcdef1234567890abcdef
   ```
3. **Extract the page ID** - it's the last part after the dash:
   ```
   1234567890abcdef1234567890abcdef
   ```

## Step 4: Set Up Environment Variables

1. **Create a `.env.local` file** in your project root
2. **Add your configuration**:

```env
# AI API Keys (optional for now)
OPENAI_API_KEY=sk-your-openai-api-key-here
CLAUDE_API_KEY=your-claude-api-key-here

# Notion API (REQUIRED)
NOTION_SECRET=secret_your-integration-token-here
NOTION_DATABASE_ID=your-database-id-here

# Environment
NODE_ENV=development
```

## Step 5: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test with a sample page ID**:
   - Use the page ID you copied in Step 3
   - The integration will now read/write to your actual Notion pages

## Available Actions

### Read Page Content
```javascript
fetch('/api/notion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'read',
    pageId: 'your-page-id-here'
  })
})
```

### Write to Page
```javascript
fetch('/api/notion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'write',
    pageId: 'your-page-id-here',
    content: 'Your content here'
  })
})
```

### Create AI Block
```javascript
fetch('/api/notion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create-ai-block',
    pageId: 'your-page-id-here',
    content: 'AI generated content',
    prompt: 'Original user prompt'
  })
})
```

### Summarize Page
```javascript
fetch('/api/notion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'summarize',
    pageId: 'your-page-id-here'
  })
})
```

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Make sure you've shared the page with your integration
   - Verify your NOTION_SECRET is correct

2. **"Page not found" Error**
   - Check that the page ID is correct
   - Ensure the page exists and is accessible

3. **"Invalid page ID" Error**
   - Page IDs should be 32 characters long
   - Remove any extra characters or dashes

### Debug Mode

To see detailed error messages, check your terminal where `npm run dev` is running.

## Security Notes

- **Never commit your `.env.local` file** to version control
- **Keep your integration token secure**
- **Only share pages you want the integration to access**
- **Consider using environment-specific tokens** for production

## Next Steps

Once the basic integration is working:

1. **Connect AI APIs** (OpenAI/Claude) for intelligent content generation
2. **Set up automated workflows** for content processing
3. **Create custom AI prompts** for your specific use cases
4. **Build advanced features** like content summarization and task generation

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Ensure your Notion integration has the necessary permissions
4. Test with a simple page first before using complex databases 
# Notion AI Integration Setup Guide

This guide will help you set up this AI integration to work inside Notion as a custom block or embedded widget.

## 🎯 What This Creates

A Notion integration that allows users to:
- Add AI blocks to any Notion page
- Use `/ai` commands for instant AI assistance
- Get AI responses directly embedded in their Notion content
- Choose between Claude and GPT-4o models

## 📋 Prerequisites

1. **Notion Developer Account**
   - Go to [Notion Developers](https://developers.notion.com/)
   - Create a new integration
   - Get your integration token

2. **API Keys**
   - OpenAI API key (for GPT-4o)
   - Claude API key (for Claude)

3. **Deployed Backend**
   - This Next.js app deployed to Netlify/Vercel
   - Environment variables configured

## 🚀 Step-by-Step Setup

### 1. Create Notion Integration

1. Visit [Notion Developers](https://developers.notion.com/)
2. Click "New integration"
3. Fill in the details:
   - **Name**: "AI Assistant"
   - **Description**: "AI-powered assistant for Notion pages"
   - **Workspace**: Select your workspace
4. Save and copy your **Internal Integration Token**

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Notion Integration
NOTION_SECRET=your-internal-integration-token-here
NOTION_DATABASE_ID=your-database-id-here

# AI APIs
OPENAI_API_KEY=sk-your-openai-api-key-here
CLAUDE_API_KEY=your-claude-api-key-here

# Optional
NODE_ENV=production
```

### 3. Deploy Your Backend

#### Option A: Deploy to Netlify

1. Connect your GitHub repo to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Deploy

#### Option B: Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### 4. Add Integration to Notion Pages

#### Method 1: Embed as iframe

1. In any Notion page, type `/embed`
2. Paste your integration URL: `https://your-domain.com/integration?pageId={PAGE_ID}`
3. The integration will appear as an embedded widget

#### Method 2: Create Custom Block (Advanced)

For a more native experience, you can create a custom block:

1. **Create a custom block component** that communicates with your backend
2. **Register the block** with Notion's block API
3. **Handle block interactions** through your API endpoints

### 5. Test the Integration

1. **Add the integration** to a Notion page
2. **Try the quick prompts**:
   - "Summarize this page"
   - "Generate action items"
   - "Explain the key concepts"
3. **Check that responses** are saved to the Notion page

## 🔧 API Endpoints

Your integration provides these endpoints:

### `/api/claude`
- **Purpose**: Get AI responses from Claude
- **Method**: POST
- **Body**: `{ "prompt": "your prompt" }`

### `/api/gpt`
- **Purpose**: Get AI responses from GPT-4o
- **Method**: POST
- **Body**: `{ "prompt": "your prompt" }`

### `/api/notion`
- **Purpose**: Interact with Notion pages
- **Method**: POST
- **Body**: `{ "action": "read|write|create-ai-block", "pageId": "...", "content": "...", "prompt": "..." }`

## 🎨 Customization

### Styling
- Modify `components/notion-integration.tsx` to match your brand
- Update colors, fonts, and layout in the component

### Functionality
- Add new AI models in `lib/api.ts`
- Create new Notion actions in `lib/notion.ts`
- Add custom prompts in the integration component

### Commands
- Extend the quick prompts array
- Add new command types
- Create specialized AI workflows

## 🔒 Security Considerations

1. **API Key Protection**
   - Never expose API keys in client-side code
   - Use environment variables for all secrets
   - Implement proper CORS policies

2. **Rate Limiting**
   - Add rate limiting to your API endpoints
   - Monitor usage to prevent abuse

3. **User Permissions**
   - Validate page access permissions
   - Implement proper authentication if needed

## 🚀 Production Deployment

### Environment Variables for Production

```env
# Required
NOTION_SECRET=your-production-notion-token
OPENAI_API_KEY=your-production-openai-key
CLAUDE_API_KEY=your-production-claude-key

# Optional
NODE_ENV=production
NOTION_DATABASE_ID=your-database-id
```

### Monitoring

1. **Set up logging** for API calls
2. **Monitor error rates** and response times
3. **Track usage metrics** for billing and optimization

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid page ID"**
   - Ensure the page ID is correct
   - Check that your integration has access to the page

2. **"API key invalid"**
   - Verify your API keys are correct
   - Check that keys have proper permissions

3. **"CORS error"**
   - Configure CORS headers in your API responses
   - Ensure your domain is whitelisted

### Debug Mode

Add this to your environment variables for debugging:

```env
DEBUG=true
NODE_ENV=development
```

## 📈 Next Steps

1. **Add more AI models** (Gemini, etc.)
2. **Create custom templates** for different use cases
3. **Add team collaboration features**
4. **Implement advanced prompt engineering**
5. **Add analytics and usage tracking**

## 🤝 Support

If you encounter issues:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the API documentation
3. Test with the provided examples
4. Contact the maintainers

---

Your Notion AI integration is now ready to enhance productivity! 🚀 
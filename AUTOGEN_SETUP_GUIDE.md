# AutoGen Integration Setup Guide

This guide will help you set up the Microsoft AutoGen multi-agent integration with your Summon Experts Next.js application.

## 🚀 Quick Start

### 1. Set up the Python AutoGen Service

Navigate to the `autogen-agentchat` directory and install dependencies:

```bash
cd autogen-agentchat
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `autogen-agentchat` directory:

```bash
# Required: API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Model overrides
OPENAI_MODEL=gpt-4o
ANTHROPIC_MODEL=claude-3-5-sonnet

# Optional: Service configuration
PORT=5057
HOST=0.0.0.0
```

### 3. Start the Python Service

Run the service using the startup script:

```bash
python start_service.py
```

Or directly with uvicorn:

```bash
uvicorn app:app --reload --port 5057
```

The service will be available at:
- **Health Check**: http://localhost:5057/
- **API Documentation**: http://localhost:5057/docs
- **Service**: http://localhost:5057

### 4. Configure Next.js Environment

Add the AutoGen service URL to your Next.js environment variables:

```bash
# In your .env.local or deployment environment
AGENT_HOST=http://localhost:5057
```

### 5. Test the Integration

Visit `/autogen-demo` in your Next.js app to test the multi-agent chat functionality.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │    │  Next.js API     │    │  Python        │
│   (Frontend)   │◄──►│  Route Proxy     │◄──►│  AutoGen       │
│                 │    │  (/api/agent)    │    │  Service       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow:
1. User sends message from React component
2. Next.js API route proxies request to Python service
3. Python service orchestrates multi-agent conversation
4. Responses stream back through Next.js to React component
5. UI updates in real-time with streaming responses

## 🔧 Configuration Options

### AutoGen Service Configuration

The Python service can be customized by modifying `app.py`:

- **Agent Roles**: Modify the `build_team()` function to change agent personalities
- **Model Selection**: Override models via environment variables
- **Termination Conditions**: Adjust when conversations end
- **Max Turns**: Control conversation length

### Next.js Integration

The integration is designed to be non-intrusive:

- **Existing Routes**: All existing API routes remain unchanged
- **New Route**: Only adds `/api/agent/send` for AutoGen communication
- **Environment**: Configurable via `AGENT_HOST` environment variable

## 🚀 Deployment

### Python Service Deployment

Deploy the Python service to any of these platforms:

- **Railway**: Simple Python deployment
- **Render**: Free tier available
- **Fly.io**: Global edge deployment
- **Azure App Service**: Enterprise-grade hosting
- **EC2**: Full control over infrastructure

### Environment Variables for Production

```bash
# Production environment variables
AGENT_HOST=https://your-autogen-service.com
OPENAI_API_KEY=your_production_openai_key
ANTHROPIC_API_KEY=your_production_anthropic_key
```

## 🧪 Testing

### Test the Python Service

```bash
# Test health endpoint
curl http://localhost:5057/

# Test session creation
curl -X POST http://localhost:5057/sessions

# Test message sending (replace SESSION_ID)
curl -X POST http://localhost:5057/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, agents!"}'
```

### Test the Next.js Integration

1. Start both services (Python + Next.js)
2. Navigate to `/autogen-demo`
3. Send a test message
4. Verify streaming responses appear

## 🔍 Troubleshooting

### Common Issues

**Python Service Won't Start**
- Check API keys are set correctly
- Verify all dependencies are installed
- Check port 5057 is available

**Next.js Can't Connect to Python Service**
- Verify `AGENT_HOST` environment variable is set
- Check Python service is running and accessible
- Test direct connection to Python service

**Streaming Not Working**
- Check browser console for errors
- Verify CORS settings in Python service
- Ensure proper headers are set in API responses

**Agents Not Responding**
- Check API key quotas and limits
- Verify model names are correct
- Check Python service logs for errors

### Debug Mode

Enable debug logging in the Python service:

```python
# In app.py, change log level
uvicorn.run(app, host="0.0.0.0", port=5057, log_level="debug")
```

## 📚 API Reference

### Python Service Endpoints

- `GET /` - Health check
- `POST /sessions` - Create new session
- `GET /sessions/{sid}` - Get session status
- `POST /sessions/{sid}/messages` - Send message (streams response)
- `DELETE /sessions/{sid}` - Delete session

### Next.js API Route

- `POST /api/agent/send` - Proxy to Python service

### React Hook

```typescript
const { 
  sessionId, 
  messages, 
  isStreaming, 
  error, 
  sendMessage, 
  cancelStream, 
  clearSession 
} = useMultiAgentStream()
```

## 🔮 Future Enhancements

### Planned Features

- **Persistent Sessions**: Store conversations in database
- **Custom Agent Types**: Specialized agents for different domains
- **Tool Integration**: Connect agents to external APIs
- **Analytics**: Track agent performance and usage
- **Multi-tenant**: Support for different user organizations

### Customization Ideas

- **Agent Specialization**: Create domain-specific agents
- **Workflow Templates**: Pre-built conversation patterns
- **Integration Hooks**: Connect to your existing business logic
- **Performance Monitoring**: Track response times and quality

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Python service logs
3. Check browser console for frontend errors
4. Verify environment variable configuration

## 🎯 Next Steps

1. **Test Locally**: Get the basic integration working
2. **Customize Agents**: Modify agent personalities and roles
3. **Deploy Service**: Move Python service to production
4. **Integrate with UI**: Add to your existing chat components
5. **Add Persistence**: Store conversations in your database
6. **Scale Up**: Add more agents and capabilities

---

**Happy Agent Orchestrating! 🤖✨**

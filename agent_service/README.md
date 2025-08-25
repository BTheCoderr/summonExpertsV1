# AutoGen Agent Service

A Python microservice that provides multi-agent AI collaboration using Microsoft AutoGen AgentChat.

## Setup

### 1. Install Dependencies
```bash
cd agent_service
pip install -r requirements.txt
```

### 2. Set Environment Variables
```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
# Optional: customize models
export OPENAI_MODEL=gpt-4o
export ANTHROPIC_MODEL=claude-3-5-sonnet-20240620
```

### 3. Run the Service
```bash
uvicorn app:app --reload --port 5057
```

## Docker Alternative

```bash
cd agent_service
docker build -t summon-experts-agents .
docker run -p 5057:5057 \
  -e OPENAI_API_KEY=sk-... \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e OPENAI_MODEL=gpt-4o \
  -e ANTHROPIC_MODEL=claude-3-5-sonnet-20240620 \
  summon-experts-agents
```

## API Endpoints

- `POST /sessions` - Create a new chat session
- `POST /sessions/{sessionId}/messages` - Send a message to agents

## Testing

```bash
# Create session
curl -s -N -X POST http://localhost:5057/sessions | jq

# Send message (replace SESSION_ID with actual session ID)
curl -s -N -H "Content-Type: application/json" \
  -d '{"message":"plan a 2 day growth sprint for a local service business"}' \
  http://localhost:5057/sessions/SESSION_ID/messages
```

## Architecture

The service creates a team of two agents:
- **Planner**: Uses GPT-4o to break down problems and create plans
- **Writer**: Uses Claude 3.5 Sonnet to turn plans into concise answers

Agents communicate in rounds until the Writer signals completion with "DONE".

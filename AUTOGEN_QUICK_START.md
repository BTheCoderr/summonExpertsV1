# 🚀 AutoGen Quick Start - READY TO USE!

## ⚡ Immediate Setup (5 minutes)

### 1. Start the Python Service
```bash
cd agent_service
source venv/bin/activate
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
python start_service.py
```

### 2. Test the Service
```bash
# In another terminal
cd agent_service
source venv/bin/activate
python test_simple.py
```

### 3. Use in Your Next.js App
Visit: `http://localhost:3000/autogen-demo`

## 📁 Key Files

- ✅ **`app_simple.py`** - Working service (use this!)
- ❌ **`app.py`** - Has compatibility issues
- ✅ **`start_service.py`** - Easy startup
- ✅ **`test_simple.py`** - Quick testing

## 🔧 What Works

- Multi-agent collaboration (Planner + Writer)
- Real-time streaming via Server-Sent Events
- OpenAI GPT-4o + Claude 3.5 Sonnet
- Session management
- FastAPI backend with Next.js frontend

## 🎯 Ready to Customize

Edit `app_simple.py` to:
- Change agent prompts
- Add more agents
- Modify models
- Customize termination conditions

## 🚨 If Something Breaks

1. **Always use `app_simple.py`** (not `app.py`)
2. **Activate virtual environment**: `source venv/bin/activate`
3. **Check API keys**: `echo $OPENAI_API_KEY`
4. **Test health**: `curl http://localhost:5057/health`

---

🎉 **You're ready to go!** The system is tested and working.

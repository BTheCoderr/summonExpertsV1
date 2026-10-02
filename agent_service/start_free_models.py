#!/usr/bin/env python3
"""
Startup script for Summon Experts FREE Local Models AutoGen Service
"""
import uvicorn
import os
import httpx
import asyncio

async def check_ollama():
    """Check if Ollama is running and what models are available"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:11434/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                print(f"✅ Ollama is running!")
                print(f"📚 Available models: {len(models)}")
                for model in models[:5]:  # Show first 5 models
                    print(f"   - {model['name']}")
                if len(models) > 5:
                    print(f"   ... and {len(models) - 5} more")
                return True
            else:
                print(f"❌ Ollama responded with status: {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("💡 Make sure Ollama is running: ollama serve")
        return False

def check_environment():
    """Check environment configuration"""
    print("🔧 Environment Configuration:")
    
    # Check Ollama settings
    ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    print(f"   📍 Ollama URL: {ollama_url}")
    print(f"   🤖 Default Model: {ollama_model}")
    
    # Check optional web search
    serper_key = os.getenv("SERPER_API_KEY", "")
    if serper_key:
        print("   🔍 Web Search: ✅ Configured (Serper API)")
    else:
        print("   🔍 Web Search: ℹ️  Not configured (optional)")
    
    # Check database
    db_url = os.getenv("DATABASE_URL", "sqlite:///./summon_experts.db")
    print(f"   🗄️  Database: {db_url}")

if __name__ == "__main__":
    print("🚀 Starting Summon Experts FREE Local Models AutoGen Service...")
    print("=" * 70)
    
    # Check environment
    check_environment()
    
    # Check Ollama
    print("\n🔍 Checking Ollama connection...")
    ollama_ok = asyncio.run(check_ollama())
    
    if not ollama_ok:
        print("\n⚠️  Ollama is not running or accessible!")
        print("💡 To start Ollama:")
        print("   1. Install Ollama: https://ollama.ai/")
        print("   2. Start service: ollama serve")
        print("   3. Pull a model: ollama pull llama3.2:3b")
        print("   4. Then run this script again")
        print("\n🚀 Service will start but may not function without Ollama")
    else:
        print("\n🎉 Ollama is ready!")
    
    print("\n📊 Features:")
    print("   ✅ Multi-agent orchestration with FREE local models")
    print("   ✅ Web search integration (optional)")
    print("   ✅ Database access and project management")
    print("   ✅ Conversation memory and context")
    print("   ✅ Specialized business expertise")
    print("   ✅ Real-time streaming responses")
    print("   💰 Cost: $0.00 (100% FREE local models!)")
    
    print(f"\n📍 Service will be available at: http://localhost:5057")
    print("📖 API docs available at: http://localhost:5057/docs")
    print("🔍 Health check: http://localhost:5057/health")
    print("🤖 Available models: http://localhost:5057/models/available")
    
    print("\n🎯 Available agent types:")
    print("   - business_planning: Strategy, Market Research, Execution")
    print("   - growth_planning: Growth Strategy, Financial Analysis")
    
    print("\n🔧 Tools available:")
    print("   - Web search: /tools/web-search (optional)")
    print("   - News search: /tools/news-search (optional)")
    print("   - Database access: /tools/database/*")
    print("   - Memory management: /memory/*")
    print("   - Model management: /models/available")
    
    print("\n" + "=" * 70)
    
    uvicorn.run(
        "app_free_models:app",
        host="0.0.0.0",
        port=5057,
        reload=True,
        log_level="info"
    )

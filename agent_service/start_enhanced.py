#!/usr/bin/env python3
"""
Enhanced startup script for Summon Experts AutoGen Service
"""
import uvicorn
import os
from app_enhanced import app

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("⚠️  Warning: Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n💡 Set them with:")
        for var in missing_vars:
            print(f"   export {var}=your_api_key_here")
        print("\n🚀 Service will start but may not function properly without these keys.")
    
    # Check optional variables
    optional_vars = ["SERPER_API_KEY", "WEB_SEARCH_API_KEY"]
    for var in optional_vars:
        if not os.getenv(var):
            print(f"ℹ️  Optional: {var} not set (web search features will be limited)")

if __name__ == "__main__":
    print("🚀 Starting Summon Experts Enhanced AutoGen Service...")
    print("=" * 60)
    
    # Check environment
    check_environment()
    
    print("\n📊 Features:")
    print("   ✅ Multi-agent orchestration (Business Planning, Growth Planning)")
    print("   ✅ Web search integration (Serper API)")
    print("   ✅ Database access and project management")
    print("   ✅ Conversation memory and context")
    print("   ✅ Specialized business expertise")
    print("   ✅ Real-time streaming responses")
    
    print(f"\n📍 Service will be available at: http://localhost:5057")
    print("📖 API docs available at: http://localhost:5057/docs")
    print("🔍 Health check: http://localhost:5057/health")
    
    print("\n🎯 Available agent types:")
    print("   - business_planning: Strategy, Market Research, Execution")
    print("   - growth_planning: Growth Strategy, Financial Analysis")
    
    print("\n🔧 Tools available:")
    print("   - Web search: /tools/web-search")
    print("   - News search: /tools/news-search")
    print("   - Database access: /tools/database/*")
    print("   - Memory management: /memory/*")
    
    print("\n" + "=" * 60)
    
    uvicorn.run(
        "app_enhanced:app",
        host="0.0.0.0",
        port=5057,
        reload=True,
        log_level="info"
    )

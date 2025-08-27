#!/usr/bin/env python3
"""
Startup script for Strategic Planning Multi-Agent Service
"""

import sys
import os
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'autogen_agentchat',
        'autogen_ext'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package}")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("Install with: pip install fastapi uvicorn pydantic autogen-agentchat autogen-ext")
        return False
    
    return True

def check_models():
    """Check if Ollama models are available"""
    print("\n🔍 Checking Ollama models...")
    
    try:
        import subprocess
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("⚠️  Ollama not running. Please start: ollama serve")
            return False
        
        models = result.stdout
        required_models = ['qwen2.5:0.5b', 'tinyllama:1.1b', 'gemma2:2b']
        
        for model in required_models:
            if model in models:
                print(f"✅ {model}")
            else:
                print(f"⚠️  {model} - Install with: ollama pull {model}")
        
        return True
        
    except FileNotFoundError:
        print("❌ Ollama not found. Please install Ollama first.")
        return False

def main():
    print("🚀 Strategic Planning Multi-Agent Service")
    print("=" * 50)
    
    print("\n📦 Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    if not check_models():
        print("\n⚠️  Some models are missing, but continuing anyway...")
    
    print("\n🎯 Starting Strategic Planning service...")
    print("📍 Port: 5057")
    print("📖 Endpoints:")
    print("   - POST /plan/start - Start new strategic plan")
    print("   - POST /plan/run?sid=X&phase=Y - Run planning phase")
    print("   - POST /plan/confirm - Confirm phase completion")
    print("   - GET /health - Health check")
    
    try:
        import uvicorn
        from strategic_planning_service import app
        
        print("\n✅ Service loaded successfully")
        print("🌐 Starting server at http://localhost:5057")
        print("🔗 Health check: http://localhost:5057/health")
        print("\n🤖 Multi-Agent Team:")
        print("   - OKRPlanner (qwen2.5:0.5b) - Creates objectives & key results")
        print("   - OKRCoach (gemma2:2b) - Reviews and improves OKRs")
        print("   - MarketAnalyst (tinyllama:1.1b) - Analyzes market opportunities")
        print("   - StrategyAgent (gemma2:2b) - Develops strategic plans")
        print("   - BusinessCoach (qwen2.5:0.5b) - Reviews plan feasibility")
        print("   - PMAgent (tinyllama:1.1b) - Creates detailed roadmaps")
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=5057,
            reload=True,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Failed to import service: {e}")
        print("   Make sure strategic_planning_service.py is in the current directory")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to start service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Service stopped by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

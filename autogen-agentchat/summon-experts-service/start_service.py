#!/usr/bin/env python3
"""
Startup script for Summon Experts Multi-Agent Service
"""

import uvicorn
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from config import config

def main():
    """Start the FastAPI service"""
    
    print("🚀 Starting Summon Experts Multi-Agent Service...")
    print(f"📍 Host: {config.HOST}")
    print(f"🔌 Port: {config.PORT}")
    print(f"🐛 Debug: {config.DEBUG}")
    print(f"🤖 Ollama Model: {config.OLLAMA_MODEL}")
    print(f"🌐 CORS Origins: {', '.join(config.get_cors_origins())}")
    print()
    print("📖 API Documentation will be available at:")
    print(f"   http://{config.HOST}:{config.PORT}/docs")
    print(f"   http://{config.HOST}:{config.PORT}/redoc")
    print()
    print("🔗 Health Check:")
    print(f"   http://{config.HOST}:{config.PORT}/")
    print()
    
    try:
        uvicorn.run(
            "main:app",
            host=config.HOST,
            port=config.PORT,
            reload=config.DEBUG,
            log_level=config.LOG_LEVEL.lower(),
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

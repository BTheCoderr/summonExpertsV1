#!/usr/bin/env python3
"""
Start the Summon Experts Agent Service
"""

import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Summon Experts Agent Service...")
    print("📍 Host: 0.0.0.0")
    print("🔌 Port: 8081")
    print("🤖 Model: llama3.2:3b (via Ollama)")
    print()
    print("📖 API Documentation:")
    print("   http://localhost:8081/docs")
    print()
    print("🔗 Health Check:")
    print("   http://localhost:8081/")
    print()
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8081,
        reload=True,
        log_level="info"
    )

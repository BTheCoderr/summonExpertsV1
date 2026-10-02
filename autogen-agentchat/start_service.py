#!/usr/bin/env python3
"""
Startup script for the Summon Experts AutoGen Service
"""
import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

def main():
    """Start the FastAPI service"""
    # Check for required environment variables
    required_vars = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these variables in your environment or .env file")
        print("Example .env file:")
        print("OPENAI_API_KEY=your_openai_key_here")
        print("ANTHROPIC_API_KEY=your_anthropic_key_here")
        print("OPENAI_MODEL=gpt-4o")
        print("ANTHROPIC_MODEL=claude-3-5-sonnet")
        return
    
    print("🚀 Starting Summon Experts AutoGen Service...")
    print(f"   OpenAI Model: {os.getenv('OPENAI_MODEL', 'gpt-4o')}")
    print(f"   Anthropic Model: {os.getenv('ANTHROPIC_MODEL', 'claude-3-5-sonnet')}")
    print(f"   Port: 5057")
    print(f"   Health Check: http://localhost:5057/")
    print(f"   API Docs: http://localhost:5057/docs")
    print("\nPress Ctrl+C to stop the service")
    
    # Start the service
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=5057,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()

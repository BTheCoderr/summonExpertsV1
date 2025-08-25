#!/usr/bin/env python3

import os
import sys
import uvicorn

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['OPENAI_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n💡 Please set these variables before starting the service.")
        print("   Example: export OPENAI_API_KEY='your-api-key-here'")
        return False
    
    print("✅ Environment variables configured")
    return True

def main():
    """Start the AutoGen Agent Service"""
    print("🚀 Starting AutoGen Agent Service...")
    print()
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Configuration
    host = os.getenv("AGENT_HOST", "0.0.0.0")
    port = int(os.getenv("AGENT_PORT", "5057"))
    
    print(f"🌐 Service will be available at: http://{host}:{port}")
    print("📱 Next.js app should connect to: http://localhost:5057")
    print()
    print("🔄 Starting server... (Press Ctrl+C to stop)")
    print()
    
    try:
        uvicorn.run(
            "app:app",
            host=host,
            port=port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

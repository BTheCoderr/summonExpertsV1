#!/usr/bin/env python3
"""
Enhanced Summon Experts Agent Service Startup Script
Multi-Model Llama Integration
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the parent directory to Python path for imports
sys.path.append(str(Path(__file__).parent.parent))

def check_ollama_models():
    """Check if required Ollama models are available"""
    print("🔍 Checking Ollama models...")
    
    try:
        import subprocess
        result = subprocess.run(['ollama', 'list'], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ Ollama is not running or not installed")
            print("   Please start Ollama: ollama serve")
            return False
        
        available_models = result.stdout
        print("✅ Ollama is running")
        
        # Check for key models
        required_models = [
            "llama3.2:3b",    # Base model
            "llama3.2:8b",    # Planning model
            "llama3.2:14b",   # Quality model
        ]
        
        optional_models = [
            "qwen2.5:0.5b",   # Ultra-fast model
            "tinyllama:1.1b", # Fast model
            "gemma2:2b",      # Quality model
        ]
        
        print("\n📋 Required models:")
        for model in required_models:
            if model in available_models:
                print(f"   ✅ {model}")
            else:
                print(f"   ❌ {model} - Please install: ollama pull {model}")
        
        print("\n🚀 Optional models (for enhanced performance):")
        for model in optional_models:
            if model in available_models:
                print(f"   ✅ {model}")
            else:
                print(f"   ⚠️  {model} - Optional: ollama pull {model}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking Ollama models: {e}")
        return False

def check_python_dependencies():
    """Check if Python dependencies are installed"""
    print("\n🔍 Checking Python dependencies...")
    
    required_packages = [
        'autogen_agentchat',
        'autogen_ext',
        'fastapi',
        'uvicorn',
        'pydantic'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package}")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("   Please install: pip install -r enhanced_requirements.txt")
        return False
    
    print("✅ All required packages are installed")
    return True

def start_service():
    """Start the enhanced agent service"""
    print("\n🚀 Starting Enhanced Summon Experts Agent Service...")
    print("📍 Multi-Model Llama Integration")
    print("🔌 Port: 8081")
    print("📖 API Documentation: http://localhost:8081/docs")
    print("🔗 Health Check: http://localhost:8081/health")
    
    try:
        # Import and start the service
        from enhanced_main import app
        import uvicorn
        
        print("\n✅ Service imported successfully")
        print("🎯 Starting Uvicorn server...")
        
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8081, 
            reload=True,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Failed to import enhanced service: {e}")
        print("   Please check that enhanced_main.py exists and is valid")
        return False
    except Exception as e:
        print(f"❌ Failed to start service: {e}")
        return False

def main():
    """Main startup function"""
    print("=" * 60)
    print("🤖 Enhanced Summon Experts Agent Service")
    print("🚀 Multi-Model Llama Integration")
    print("=" * 60)
    
    # Check prerequisites
    if not check_ollama_models():
        print("\n❌ Ollama setup incomplete. Please fix issues above.")
        return False
    
    if not check_python_dependencies():
        print("\n❌ Python dependencies incomplete. Please fix issues above.")
        return False
    
    print("\n✅ All prerequisites met!")
    print("🎯 Starting enhanced agent service...")
    
    # Start the service
    return start_service()

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n👋 Service stopped by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

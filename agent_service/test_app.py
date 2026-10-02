#!/usr/bin/env python3

import os
import sys

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all required modules can be imported"""
    try:
        import autogen_agentchat.agents
        import autogen_agentchat.teams
        import autogen_agentchat.conditions
        import autogen_ext.models.openai
        from fastapi import FastAPI
        print("✅ All required modules imported successfully!")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def test_app_structure():
    """Test that the app structure is correct"""
    try:
        # Import without initializing the client
        from app import app, build_team
        from fastapi import FastAPI
        
        # Check if it's a FastAPI app
        if isinstance(app, FastAPI):
            print("✅ FastAPI app created successfully!")
        else:
            print("❌ App is not a FastAPI instance")
            return False
            
        # Check if build_team is callable
        if callable(build_team):
            print("✅ build_team function is callable!")
        else:
            print("❌ build_team is not callable")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ App structure error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing AutoGen Agent Service...")
    print()
    
    success = True
    success &= test_imports()
    success &= test_app_structure()
    
    print()
    if success:
        print("🎉 All tests passed! The service is ready to run.")
        print("💡 Set OPENAI_API_KEY environment variable to start the service.")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        sys.exit(1)

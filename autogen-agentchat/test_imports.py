#!/usr/bin/env python3
"""
Test script to verify all AutoGen imports work correctly
"""

def test_imports():
    """Test all required imports."""
    print("🧪 Testing AutoGen imports...")
    
    try:
        # Test core imports
        from autogen_core.models import UserMessage
        print("✅ autogen_core.models imported successfully")
        
        from autogen_core import CancellationToken
        print("✅ autogen_core.CancellationToken imported successfully")
        
        # Test agentchat imports
        from autogen_agentchat.agents import AssistantAgent
        print("✅ autogen_agentchat.agents imported successfully")
        
        from autogen_agentchat.messages import TextMessage
        print("✅ autogen_agentchat.messages imported successfully")
        
        # Test ext imports
        from autogen_ext.models.openai import OpenAIChatCompletionClient
        print("✅ autogen_ext.models.openai imported successfully")
        
        from autogen_ext.models.ollama import OllamaChatCompletionClient
        print("✅ autogen_ext.models.ollama imported successfully")
        
        # Test other dependencies
        from dotenv import load_dotenv
        print("✅ python-dotenv imported successfully")
        
        import streamlit as st
        print("✅ streamlit imported successfully")
        
        import fastapi
        print("✅ fastapi imported successfully")
        
        print("\n🎉 All imports successful! Your environment is properly configured.")
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_imports()

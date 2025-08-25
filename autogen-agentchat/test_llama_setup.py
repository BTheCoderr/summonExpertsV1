#!/usr/bin/env python3
"""
Test script to verify Llama setup with AutoGen
"""

import asyncio
from autogen_ext.models.ollama import OllamaChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken

async def test_llama_setup():
    """Test the complete Llama + AutoGen setup."""
    print("🦙 Testing Llama + AutoGen Setup")
    print("=" * 40)
    
    try:
        # Test 1: Basic Llama client
        print("\n1️⃣ Testing Llama client...")
        llama_client = OllamaChatCompletionClient(model="llama3.2:3b")
        print("✅ Llama client created successfully")
        
        # Test 2: Create agent
        print("\n2️⃣ Testing AssistantAgent creation...")
        agent = AssistantAgent(
            name="TestAgent",
            system_message="You are a helpful test assistant.",
            model_client=llama_client
        )
        print("✅ AssistantAgent created successfully")
        
        # Test 3: Test communication
        print("\n3️⃣ Testing agent communication...")
        message = TextMessage(content="Say hello!", source="user")
        response = await agent.on_messages(
            messages=[message], 
            cancellation_token=CancellationToken()
        )
        print("✅ Agent communication successful!")
        print(f"🤖 Response: {response.chat_message.content}")
        
        print("\n🎉 All tests passed! Your Llama + AutoGen setup is working perfectly!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Ollama is running: ollama serve")
        print("2. Make sure Llama model is available: ollama list")
        print("3. Check virtual environment is activated")
        return False

if __name__ == "__main__":
    asyncio.run(test_llama_setup())

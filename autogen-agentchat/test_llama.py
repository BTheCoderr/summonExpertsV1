#!/usr/bin/env python3
"""
Test script to verify Llama works with AutoGen using Ollama
"""

import asyncio
from autogen_core.models import UserMessage
from autogen_ext.models.ollama import OllamaChatCompletionClient

async def test_llama():
    """Test Llama with AutoGen."""
    print("🦙 Testing Llama with AutoGen...")
    
    try:
        # Initialize Ollama client
        ollama_client = OllamaChatCompletionClient(
            model="llama3.2:3b",  # Using the model you already have
        )
        
        print("✅ Ollama client initialized")
        
        # Test simple message
        print("📝 Sending test message...")
        response = await ollama_client.create([
            UserMessage(content="Hello! Can you tell me a short joke?", source="user")
        ])
        
        print("✅ Response received!")
        print(f"🤖 Llama says: {response.content}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_llama_agent():
    """Test Llama with a simple AutoGen agent."""
    print("\n🤖 Testing Llama with AutoGen Agent...")
    
    try:
        from autogen_agentchat.agents import AssistantAgent
        
        # Initialize Ollama client
        ollama_client = OllamaChatCompletionClient(
            model="llama3.2:3b",
        )
        
        # Create a simple agent
        agent = AssistantAgent(
            name="LlamaAgent",
            system_message="You are a helpful AI assistant powered by Llama.",
            model_client=ollama_client
        )
        
        print("✅ Agent created successfully")
        
        # Test the agent
        from autogen_agentchat.messages import TextMessage
        from autogen_core import CancellationToken
        
        message = TextMessage(content="What is 2 + 2?", source="user")
        response = await agent.on_messages(
            messages=[message], 
            cancellation_token=CancellationToken()
        )
        
        print("✅ Agent response received!")
        print(f"🤖 Agent says: {response.chat_message.content}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def main():
    """Main test function."""
    print("🚀 Llama + AutoGen Test")
    print("=" * 40)
    
    # Test basic Llama functionality
    basic_ok = await test_llama()
    
    if basic_ok:
        # Test with AutoGen agent
        agent_ok = await test_llama_agent()
        
        if agent_ok:
            print("\n🎉 All tests passed! Llama is working with AutoGen!")
            print("\n🚀 You can now:")
            print("1. Use Llama in your notebooks")
            print("2. Run projects with Llama instead of OpenAI")
            print("3. Test multi-agent systems locally")
        else:
            print("\n⚠️  Basic Llama works, but agent test failed")
    else:
        print("\n❌ Basic Llama test failed")
        print("💡 Make sure Ollama is running: ollama serve")

if __name__ == "__main__":
    asyncio.run(main())

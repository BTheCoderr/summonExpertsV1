#!/usr/bin/env python3
"""
Simple test script to verify AutoGen basic functionality
"""

import asyncio
from autogen_ext.models.ollama import OllamaChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken

async def test_basic_agent():
    """Test the most basic AutoGen agent functionality"""
    
    print("🚀 Testing Basic AutoGen Agent...")
    print("=" * 50)
    
    try:
        # 1. Test imports
        print("✅ All imports successful")
        
        # 2. Create Ollama client
        print("🦙 Creating Ollama client...")
        llama_client = OllamaChatCompletionClient(
            model='llama3.2:3b'
        )
        print("✅ Ollama client created")
        
        # 3. Create assistant agent
        print("🤖 Creating Assistant Agent...")
        assistant = AssistantAgent(
            name='TestAssistant',
            system_message='You are a helpful AI assistant. Answer questions clearly and concisely.',
            model_client=llama_client
        )
        print("✅ Assistant agent created successfully!")
        
        # 4. Test basic message
        print("💬 Testing basic message...")
        message = TextMessage(
            content='Hello! Can you tell me what AutoGen is in one sentence?', 
            source='user'
        )
        
        print("📝 Sending message:", message.content)
        response = await assistant.on_messages([message], cancellation_token=CancellationToken())
        
        print("🤖 Response received!")
        print("📝 Question:", message.content)
        print("🤖 Response:", response.chat_message.content)
        
        print("\n🎉 Basic agent test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_agent_with_tools():
    """Test agent with basic tool capabilities"""
    
    print("\n🔧 Testing Agent with Tools...")
    print("=" * 50)
    
    try:
        # Create agent with tools
        llama_client = OllamaChatCompletionClient(model='llama3.2:3b')
        
        assistant = AssistantAgent(
            name='ToolAssistant',
            system_message='You are an AI assistant that can help with basic tasks. You have access to some tools.',
            model_client=llama_client
        )
        
        # Test reflection capability
        print("🧠 Testing agent reflection...")
        message = TextMessage(
            content='What tools do you have access to?', 
            source='user'
        )
        
        response = await assistant.on_messages([message], cancellation_token=CancellationToken())
        print("🤖 Response:", response.chat_message.content)
        
        print("✅ Tool agent test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Tool test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 AutoGen Basic Functionality Test")
    print("=" * 60)
    
    # Test 1: Basic agent
    success1 = await test_basic_agent()
    
    # Test 2: Agent with tools
    success2 = await test_agent_with_tools()
    
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Basic Agent: {'✅ PASS' if success1 else '❌ FAIL'}")
    print(f"Tool Agent:  {'✅ PASS' if success2 else '❌ FAIL'}")
    
    if success1 and success2:
        print("\n🎉 ALL TESTS PASSED! AutoGen is working correctly.")
        print("\n📝 Next steps:")
        print("1. Explore the notebooks in '02-important-autogen-concepts/'")
        print("2. Try the projects in '03 - Project 1/' and '05 - Project2/'")
        print("3. Build your own custom agents!")
    else:
        print("\n❌ Some tests failed. Check the error messages above.")
        print("💡 Common issues:")
        print("   - Ollama not running")
        print("   - Model not downloaded")
        print("   - Network connectivity issues")

if __name__ == "__main__":
    asyncio.run(main())

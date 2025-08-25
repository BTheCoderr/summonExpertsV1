#!/usr/bin/env python3
"""
Test the Llama agent functionality
"""

import asyncio
from agent_llama import get_code_explanation, get_code_optimization

async def test_llama_agent():
    """Test the Llama agent with simple code."""
    print("🧪 Testing Llama Agent...")
    
    # Test code
    test_code = 'def hello(): print("Hello, World!")'
    
    print("📝 Testing code explanation...")
    try:
        explanation = await get_code_explanation(test_code)
        print("✅ Code explanation successful!")
        print(f"Explanation: {explanation[:200]}...")
    except Exception as e:
        print(f"❌ Code explanation failed: {e}")
        return False
    
    print("\n📝 Testing code optimization...")
    try:
        optimization = await get_code_optimization(test_code)
        print("✅ Code optimization successful!")
        print(f"Optimization: {optimization[:200]}...")
    except Exception as e:
        print(f"❌ Code optimization failed: {e}")
        return False
    
    print("\n🎉 All tests passed! Llama agent is working!")
    return True

if __name__ == "__main__":
    asyncio.run(test_llama_agent())

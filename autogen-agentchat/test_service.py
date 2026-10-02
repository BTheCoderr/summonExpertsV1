#!/usr/bin/env python3
"""
Test script for the AutoGen service
"""
import asyncio
import json
import aiohttp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_service():
    """Test the AutoGen service endpoints"""
    base_url = "http://localhost:5057"
    
    print("🧪 Testing AutoGen Service...")
    print(f"   Base URL: {base_url}")
    print()
    
    async with aiohttp.ClientSession() as session:
        # Test health endpoint
        print("1. Testing health endpoint...")
        try:
            async with session.get(f"{base_url}/") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"   ✅ Health check passed: {data}")
                else:
                    print(f"   ❌ Health check failed: {resp.status}")
                    return
        except Exception as e:
            print(f"   ❌ Health check error: {e}")
            return
        
        # Test session creation
        print("\n2. Testing session creation...")
        try:
            async with session.post(f"{base_url}/sessions") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    session_id = data.get("sessionId")
                    print(f"   ✅ Session created: {session_id}")
                else:
                    print(f"   ❌ Session creation failed: {resp.status}")
                    return
        except Exception as e:
            print(f"   ❌ Session creation error: {e}")
            return
        
        # Test message sending
        print("\n3. Testing message sending...")
        test_message = "Hello! Can you help me plan a weekend trip to San Francisco?"
        
        try:
            async with session.post(
                f"{base_url}/sessions/{session_id}/messages",
                json={"message": test_message}
            ) as resp:
                if resp.status == 200:
                    print(f"   ✅ Message sent successfully")
                    print(f"   📝 Test message: {test_message}")
                    print(f"   🔄 Response headers: {dict(resp.headers)}")
                    
                    # Try to read the streaming response
                    print(f"   📡 Reading streaming response...")
                    async for line in resp.content:
                        line_str = line.decode('utf-8').strip()
                        if line_str:
                            print(f"      📨 {line_str}")
                            if "event: done" in line_str:
                                break
                else:
                    print(f"   ❌ Message sending failed: {resp.status}")
                    text = await resp.text()
                    print(f"   📄 Response: {text}")
        except Exception as e:
            print(f"   ❌ Message sending error: {e}")
        
        # Test session cleanup
        print("\n4. Testing session cleanup...")
        try:
            async with session.delete(f"{base_url}/sessions/{session_id}") as resp:
                if resp.status == 200:
                    data = await resp.json()
                    print(f"   ✅ Session deleted: {data}")
                else:
                    print(f"   ❌ Session deletion failed: {resp.status}")
        except Exception as e:
            print(f"   ❌ Session deletion error: {e}")
    
    print("\n🎉 Testing completed!")

if __name__ == "__main__":
    # Check if service is running
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 5057))
    sock.close()
    
    if result != 0:
        print("❌ AutoGen service is not running on port 5057")
        print("   Please start the service first:")
        print("   cd autogen-agentchat")
        print("   python start_service.py")
        exit(1)
    
    # Run tests
    asyncio.run(test_service())

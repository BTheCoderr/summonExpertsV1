#!/usr/bin/env python3
"""
Simple test for the working AutoGen service
"""
import asyncio
import requests
import json

BASE_URL = "http://localhost:5057"

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_session_creation():
    """Test session creation"""
    try:
        response = requests.post(f"{BASE_URL}/sessions")
        if response.status_code == 200:
            data = response.json()
            session_id = data.get("sessionId")
            print(f"✅ Session created: {session_id[:8]}...")
            return session_id
        else:
            print(f"❌ Session creation failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Session creation error: {e}")
        return None

def main():
    print("🧪 Testing AutoGen Service...")
    print("=" * 40)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    if not test_health():
        print("❌ Service is not running. Start it with: python start_service.py")
        return
    
    # Test 2: Session creation
    print("\n2. Testing session creation...")
    session_id = test_session_creation()
    if not session_id:
        print("❌ Failed to create session")
        return
    
    print("\n🎉 All tests passed! Service is working correctly.")
    print(f"\n📝 Next steps:")
    print(f"   1. Set your API keys: export OPENAI_API_KEY=sk-...")
    print(f"   2. Set your API keys: export ANTHROPIC_API_KEY=sk-ant-...")
    print(f"   3. Test with a real message using the session ID: {session_id}")
    print(f"   4. Visit http://localhost:3000/autogen-demo in your Next.js app")

if __name__ == "__main__":
    main()

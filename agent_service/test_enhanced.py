#!/usr/bin/env python3
"""
Enhanced test script for Summon Experts AutoGen Service
"""
import asyncio
import requests
import json
import time

BASE_URL = "http://localhost:5057"

def test_health():
    """Test the enhanced health endpoint"""
    print("1. Testing enhanced health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed!")
            print(f"   Service: {data.get('service')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Features: {', '.join(data.get('features', []))}")
            print(f"   Agent Types: {', '.join(data.get('available_agent_types', []))}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_business_planning_session():
    """Test business planning session creation"""
    print("\n2. Testing business planning session creation...")
    try:
        response = requests.post(f"{BASE_URL}/sessions", json="business_planning")
        if response.status_code == 200:
            data = response.json()
            session_id = data.get("sessionId")
            agent_type = data.get("agent_type")
            print(f"✅ Business planning session created!")
            print(f"   Session ID: {session_id[:8]}...")
            print(f"   Agent Type: {agent_type}")
            return session_id
        else:
            print(f"❌ Session creation failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Session creation error: {e}")
        return None

def test_growth_planning_session():
    """Test growth planning session creation"""
    print("\n3. Testing growth planning session creation...")
    try:
        response = requests.post(f"{BASE_URL}/sessions", json="growth_planning")
        if response.status_code == 200:
            data = response.json()
            session_id = data.get("sessionId")
            agent_type = data.get("agent_type")
            print(f"✅ Growth planning session created!")
            print(f"   Session ID: {session_id[:8]}...")
            print(f"   Agent Type: {agent_type}")
            return session_id
        else:
            print(f"❌ Session creation failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Session creation error: {e}")
        return None

def test_tools():
    """Test available tools"""
    print("\n4. Testing available tools...")
    
    # Test web search (will fail without API key, but endpoint should work)
    try:
        response = requests.post(f"{BASE_URL}/tools/web-search", json="business strategy trends")
        if response.status_code == 200:
            data = response.json()
            if "error" in str(data):
                print("ℹ️  Web search endpoint works (API key not configured)")
            else:
                print("✅ Web search tool working!")
        else:
            print(f"❌ Web search failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Web search error: {e}")
    
    # Test memory endpoint
    try:
        response = requests.get(f"{BASE_URL}/memory/test-session")
        if response.status_code == 200:
            print("✅ Memory management endpoint working!")
        else:
            print(f"❌ Memory endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Memory endpoint error: {e}")

def test_agent_conversation(session_id: str):
    """Test agent conversation"""
    print(f"\n5. Testing agent conversation with session {session_id[:8]}...")
    
    test_message = "Create a 90-day business strategy for a local consulting firm"
    
    try:
        response = requests.post(
            f"{BASE_URL}/sessions/{session_id}/messages",
            json={"message": test_message},
            stream=True
        )
        
        if response.status_code == 200:
            print("✅ Message sent, streaming response...")
            print("📝 Response preview:")
            
            # Read first few lines to test streaming
            line_count = 0
            for line in response.iter_lines():
                if line and line_count < 10:  # Limit to first 10 lines for testing
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        try:
                            data = json.loads(line_str[6:])
                            if data.get('type') == 'error':
                                print(f"❌ Error: {data.get('message')}")
                            elif data.get('content'):
                                source = data.get('source', 'Agent')
                                content = data.get('content', '')[:100]  # Truncate for display
                                print(f"🤖 {source}: {content}...")
                            line_count += 1
                        except json.JSONDecodeError:
                            continue
                    elif line_str == 'event: done':
                        print("✅ Stream completed")
                        break
                else:
                    break
        else:
            print(f"❌ Failed to send message: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error sending message: {e}")

def main():
    print("🧪 Testing Summon Experts Enhanced AutoGen Service...")
    print("=" * 70)
    
    # Test 1: Health check
    if not test_health():
        print("❌ Service is not running. Start it with: python start_enhanced.py")
        return
    
    # Test 2: Business planning session
    business_session = test_business_planning_session()
    if not business_session:
        print("❌ Failed to create business planning session")
        return
    
    # Test 3: Growth planning session
    growth_session = test_growth_planning_session()
    if not growth_session:
        print("❌ Failed to create growth planning session")
        return
    
    # Test 4: Tools
    test_tools()
    
    # Test 5: Agent conversation
    test_agent_conversation(business_session)
    
    print("\n🎉 All tests completed!")
    print(f"\n📝 Next steps:")
    print(f"   1. Set your API keys: export OPENAI_API_KEY=sk-...")
    print(f"   2. Set your API keys: export ANTHROPIC_API_KEY=sk-ant-...")
    print(f"   3. Optional: Set SERPER_API_KEY for web search features")
    print(f"   4. Test with real conversations using the session IDs above")
    print(f"   5. Visit http://localhost:3000/autogen-demo in your Next.js app")
    
    print(f"\n🔧 Available endpoints:")
    print(f"   - Health: GET /health")
    print(f"   - Sessions: POST /sessions")
    print(f"   - Messages: POST /sessions/{{session_id}}/messages")
    print(f"   - Tools: POST /tools/web-search, /tools/news-search")
    print(f"   - Memory: GET /memory/{{session_id}}")
    print(f"   - Database: GET /tools/database/projects/{{user_id}}")

if __name__ == "__main__":
    main()

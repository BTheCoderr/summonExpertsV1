#!/usr/bin/env python3
"""
Simple test script for the AutoGen microservice
"""
import requests
import json
import time

BASE_URL = "http://localhost:5057"

def test_service():
    print("🧪 Testing AutoGen Microservice...")
    
    # Test 1: Create session
    print("\n1. Creating session...")
    try:
        resp = requests.post(f"{BASE_URL}/sessions")
        if resp.status_code == 200:
            session_data = resp.json()
            session_id = session_data["sessionId"]
            print(f"✅ Session created: {session_id[:8]}...")
        else:
            print(f"❌ Failed to create session: {resp.status_code}")
            return
    except Exception as e:
        print(f"❌ Error creating session: {e}")
        return
    
    # Test 2: Send message
    print("\n2. Sending test message...")
    test_message = "Give me 3 quick tips for improving customer retention"
    
    try:
        resp = requests.post(
            f"{BASE_URL}/sessions/{session_id}/messages",
            json={"message": test_message},
            stream=True
        )
        
        if resp.status_code == 200:
            print("✅ Message sent, streaming response...")
            print("\n📝 Response:")
            
            for line in resp.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        try:
                            data = json.loads(line_str[6:])
                            if data.get('type') == 'error':
                                print(f"❌ Error: {data.get('message')}")
                            elif data.get('content'):
                                source = data.get('source', 'Agent')
                                print(f"🤖 {source}: {data.get('content')}")
                        except json.JSONDecodeError:
                            continue
                    elif line_str == 'event: done':
                        print("\n✅ Stream completed")
                        break
        else:
            print(f"❌ Failed to send message: {resp.status_code}")
            
    except Exception as e:
        print(f"❌ Error sending message: {e}")

if __name__ == "__main__":
    test_service()

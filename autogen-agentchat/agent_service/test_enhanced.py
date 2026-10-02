#!/usr/bin/env python3
"""
Test script for Enhanced Summon Experts Agent Service
Tests the multi-model Llama integration
"""

import asyncio
import requests
import json
from typing import Dict, Any

# Configuration
SERVICE_URL = "http://localhost:8081"

def test_health():
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    
    try:
        response = requests.get(f"{SERVICE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to service. Is it running?")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_service_info():
    """Test the root endpoint for service information"""
    print("\n🔍 Testing service info...")
    
    try:
        response = requests.get(f"{SERVICE_URL}/")
        if response.status_code == 200:
            info = response.json()
            print("✅ Service info retrieved")
            print(f"   Service: {info.get('service')}")
            print(f"   Version: {info.get('version')}")
            print(f"   Models: {info.get('models')}")
            return True
        else:
            print(f"❌ Service info failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Service info error: {e}")
        return False

def test_agent_stream():
    """Test the agent streaming endpoint"""
    print("\n🔍 Testing agent streaming...")
    
    test_messages = [
        {
            "message": "Hello, can you help me plan my business strategy?",
            "agent_type": "general"
        },
        {
            "message": "Create OKRs for a SaaS business with $10k monthly revenue goal",
            "agent_type": "okr"
        }
    ]
    
    for i, test_data in enumerate(test_messages, 1):
        print(f"\n   Testing message {i}: {test_data['agent_type']}")
        
        try:
            response = requests.post(
                f"{SERVICE_URL}/agent/stream",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Response received")
                print(f"   📝 Agent type: {result.get('agent_type')}")
                print(f"   📄 Response length: {len(result.get('response', ''))} chars")
                
                # Show first 200 characters of response
                response_text = result.get('response', '')
                preview = response_text[:200] + "..." if len(response_text) > 200 else response_text
                print(f"   💬 Preview: {preview}")
                
            else:
                print(f"   ❌ Request failed: {response.status_code}")
                try:
                    error = response.json()
                    print(f"   🚨 Error: {error.get('error', 'Unknown error')}")
                except:
                    print(f"   🚨 Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"   ❌ Request error: {e}")
            return False
    
    return True

def test_okr_endpoint():
    """Test the OKR generation endpoint"""
    print("\n🔍 Testing OKR endpoint...")
    
    test_data = {
        "inputs": {
            "revenueGoal90d": 50000.0,
            "customerGoal90d": 100,
            "challenges": ["Market competition", "Customer acquisition"],
            "availabilityHrsPerWeek": 20.0,
            "business": {
                "name": "Test SaaS Business",
                "industry": "Software",
                "description": "A test business for validation",
                "location": {
                    "country": "United States",
                    "state": "California"
                },
                "avgDealSize": 500.0,
                "currentRevenueMonthly": 10000.0,
                "channels": ["Online", "Referrals"]
            },
            "startDate": "2024-08-22",
            "endDate": "2024-11-22"
        },
        "focus": "balanced"
    }
    
    try:
        response = requests.post(
            f"{SERVICE_URL}/okr",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ OKR generation successful")
            print(f"   📝 Response length: {len(result.get('okr', ''))} chars")
            
            # Show first 200 characters of response
            okr_text = result.get('okr', '')
            preview = okr_text[:200] + "..." if len(okr_text) > 200 else okr_text
            print(f"   💬 Preview: {preview}")
            
            return True
        else:
            print(f"❌ OKR generation failed: {response.status_code}")
            try:
                error = response.json()
                print(f"🚨 Error: {error.get('error', 'Unknown error')}")
            except:
                print(f"🚨 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ OKR test error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Enhanced Agent Service Test Suite")
    print("🚀 Multi-Model Llama Integration")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health),
        ("Service Info", test_service_info),
        ("Agent Streaming", test_agent_stream),
        ("OKR Generation", test_okr_endpoint),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🎯 Running: {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your enhanced agent service is working correctly.")
        print("\n🚀 Next steps:")
        print("   1. Add AGENT_HOST=http://localhost:8081 to your .env.local")
        print("   2. Use the useMultiAgentStream hook in your Next.js components")
        print("   3. Test different agent types (okr, market, strategy, roadmap)")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print("\n🔧 Troubleshooting:")
        print("   1. Ensure the enhanced service is running: python start_enhanced.py")
        print("   2. Check that Ollama is running: ollama serve")
        print("   3. Verify required models are installed: ollama list")
    
    return passed == total

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n👋 Tests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        exit(1)

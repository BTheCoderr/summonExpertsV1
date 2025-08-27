#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests the multi-agent strategic planning integration
 */

console.log('🧪 Testing Multi-Agent Strategic Planning Integration...\n')

const tests = [
  {
    name: 'Customer Support Multi-Agent System',
    url: 'http://localhost:5057/chat/',
    method: 'POST',
    body: JSON.stringify({
      query: 'What is the price of Apple iPhone 15 Pro?'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Strategic Planning API',
    url: 'http://localhost:3000/api/strategic-plans/current',
    method: 'GET'
  }
]

async function runTests() {
  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`)
    
    try {
      const response = await fetch(test.url, {
        method: test.method || 'GET',
        headers: test.headers || {},
        body: test.body || undefined
      })
      
      if (response.ok) {
        console.log(`✅ ${test.name}: PASSED`)
        
        if (test.url.includes('chat')) {
          const result = await response.json()
          console.log(`   📝 Response preview: ${result.response?.substring(0, 100)}...`)
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${response.status})`)
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`)
    }
    
    console.log('')
  }
}

// Check if we're running in Node.js
if (typeof fetch === 'undefined') {
  console.log('⚠️  This test requires Node.js 18+ with fetch support')
  console.log('   Or run: npm install node-fetch')
  process.exit(1)
}

runTests().then(() => {
  console.log('🎉 Integration tests completed!')
  console.log('\n📋 Next Steps:')
  console.log('1. Start your multi-agent service: cd autogen-agentchat/05-Project2-Multi-AgentAIChatbotForCustomerSupport && uvicorn team_api_llama:app --host 127.0.0.1 --port 5057 --reload')
  console.log('2. Start Next.js: npm run dev')
  console.log('3. Visit: http://localhost:3000/customer-support')
  console.log('4. Visit: http://localhost:3000/strategic-planning')
  console.log('5. Test the multi-agent workflows!')
})

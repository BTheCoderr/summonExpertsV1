'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, ShoppingCart, Package, AlertTriangle, Brain, Loader2 } from 'lucide-react'
import { useMultiAgentStream } from '@/hooks/useMultiAgentStream'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function CustomerSupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { sendMessage } = useMultiAgentStream()

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsProcessing(true)

    try {
      // Send message to your existing multi-agent system
      await sendMessage(inputMessage)
      
      // Add a placeholder for the agent response
      const agentMessage: ChatMessage = {
        role: 'assistant',
        content: '🤖 Multi-agent system is processing your request...',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '❌ Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const exampleQueries = [
    "What is the price of Apple iPhone 15 Pro?",
    "I want to buy 2 Dell XPS 15 laptops",
    "Check my order status for Order ID: ORD-2",
    "I received a defective product, and I want to raise a complaint"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🤖 Multi-Agent Customer Support
          </h1>
          <p className="text-xl text-gray-300">
            Powered by 3 Ultra-Tiny Llama Models Working Together
          </p>
          <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-400">
            <span>🦙 qwen2.5:0.5b (Planning)</span>
            <span>🦙 tinyllama:1.1b (Operations)</span>
            <span>🦙 gemma2:2b (Quality)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="glass-panel border-white/10 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                  Customer Support Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Start a conversation with our multi-agent support team!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Multi-agent system is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about products, place orders, check status, or register complaints..."
                    className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isProcessing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features & Examples */}
          <div className="space-y-6">
            {/* Features */}
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-green-400" />
                  Multi-Agent Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  <span>Product Information & Pricing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Package className="w-4 h-4 text-green-400" />
                  <span>Order Placement & Tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span>Complaint Registration</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Intelligent Task Delegation</span>
                </div>
              </CardContent>
            </Card>

            {/* Example Queries */}
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-yellow-400" />
                  Try These Examples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {exampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(query)}
                    className="text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700/50 transition-colors w-full"
                  >
                    "{query}"
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400 space-y-2">
                <p><strong>Planning Agent:</strong> qwen2.5:0.5b (397MB) - Fast coordination</p>
                <p><strong>Operations Agents:</strong> tinyllama:1.1b (637MB) - Product & orders</p>
                <p><strong>Quality Agent:</strong> gemma2:2b (1.6GB) - Response formatting</p>
                <p><strong>Total Size:</strong> ~2.6GB - All local, no API costs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

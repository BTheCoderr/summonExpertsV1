'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Sparkles, Bot, Copy, Check } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: '✨ **Page Summary Generated**\n\nI\'ve analyzed your "Project Alpha" page and extracted the key insights:\n\n• **Status**: 60% complete, on track for Q2 launch\n• **Key Risks**: Resource allocation, timeline dependencies\n• **Next Actions**: Finalize MVP features, schedule user testing\n\nWould you like me to create action items from this summary?',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    type: 'ai',
    content: '📋 **Action Items Created**\n\nBased on your meeting notes, I\'ve generated these tasks:\n\n1. **High Priority**\n   - Schedule design review with stakeholders\n   - Update project timeline in Notion\n   - Prepare demo for client presentation\n\n2. **Medium Priority**\n   - Research competitor analysis\n   - Draft user feedback survey\n\nAll items have been added to your "Tasks" database with due dates.',
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '3',
    type: 'ai',
    content: '🧠 **Concept Explanation**\n\n**API Rate Limiting** is a technique to control the number of requests a client can make to prevent system overload.\n\n**Key Components:**\n• **Throttling**: Slows down requests when limits are approached\n• **Quotas**: Sets maximum requests per time window\n• **Backoff**: Implements delays for retry attempts\n\n**Implementation**: Most commonly using token bucket or sliding window algorithms.\n\nThis helps maintain system stability and fair resource usage across all users.',
    timestamp: new Date(Date.now() - 60000)
  }
]

export function CommandPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '🎯 **Command Executed**\n\nI\'ve processed your request and here\'s what I found:\n\n• Analyzed the current page context\n• Generated relevant insights\n• Prepared actionable recommendations\n\nThe results have been formatted and are ready for integration into your Notion workspace. Would you like me to create a new page with these findings?',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, aiMessage])
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Hero Section */}
      <div className="p-8 border-b border-gray-700/50">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Command Your Knowledge
          </h1>
          <p className="text-gray-400 text-sm">
            Transform your Notion workspace with intelligent AI commands
          </p>
        </div>
      </div>

      {/* Command Input */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="relative max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl" />
          <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="text-gray-500 font-mono text-sm">/</div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="summarize this page, create tasks, explain concept..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-0 text-gray-200 placeholder-gray-500 focus-visible:ring-0 text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-purple-600'
              } shadow-lg`}>
                {message.type === 'user' ? (
                  <div className="w-4 h-4 bg-white rounded-full" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-full ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-100'
                } rounded-2xl p-4 shadow-lg relative group`}>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {message.content}
                    </pre>
                  </div>
                  
                  {/* Copy Button */}
                  {message.type === 'ai' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700/50 hover:bg-gray-600/50"
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-300" />
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-sm text-gray-300">Processing command...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
} 
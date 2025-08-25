'use client'

import { useState, useRef, useEffect } from 'react'
import { useMultiAgentStream } from '@/hooks/useMultiAgentStream'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'

export default function AutogenChatIntegrated() {
  const { messages, sendMessage } = useMultiAgentStream()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    setIsLoading(true)
    try {
      await sendMessage(inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAgentIcon = (name?: string) => {
    if (!name) return <Bot className="w-5 h-5 text-blue-500" />
    
    switch (name.toLowerCase()) {
      case 'planner':
        return <Sparkles className="w-5 h-5 text-purple-500" />
      case 'writer':
        return <Bot className="w-5 h-5 text-green-500" />
      default:
        return <Bot className="w-5 h-5 text-blue-500" />
    }
  }

  const getAgentColor = (name?: string) => {
    if (!name) return 'bg-blue-50 border-blue-200'
    
    switch (name.toLowerCase()) {
      case 'planner':
        return 'bg-purple-50 border-purple-200'
      case 'writer':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Strategy Team
            </CardTitle>
          </div>
          <p className="text-gray-600 text-sm">
            Collaborate with our AI agents: Planner and Writer working together
          </p>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 mb-6 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-sm">
                  Ask about business strategy, planning, or any complex problem
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'user' ? (
                    <>
                      <div className="max-w-[80%]">
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {getAgentIcon(message.name)}
                        </div>
                      </div>
                      <div className="max-w-[80%]">
                        <div className={`border rounded-2xl rounded-bl-md px-4 py-3 ${getAgentColor(message.name)}`}>
                          {message.name && (
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {message.name}
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about business strategy, planning, or any complex problem..."
                className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("Plan a 90-day growth strategy for a SaaS business")}
          className="text-xs"
        >
          Growth Strategy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("Analyze market opportunities for a local service business")}
          className="text-xs"
        >
          Market Analysis
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputValue("Create a customer acquisition plan for an e-commerce store")}
          className="text-xs"
        >
          Customer Acquisition
        </Button>
      </div>
    </div>
  )
}

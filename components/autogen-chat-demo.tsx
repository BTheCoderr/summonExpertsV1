"use client"

import { useState } from "react"
import { useMultiAgentStream } from "./hooks/useMultiAgentStream"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function AutoGenChatDemo() {
  const [inputValue, setInputValue] = useState("")
  const { 
    sessionId, 
    messages, 
    isStreaming, 
    error, 
    sendMessage, 
    cancelStream, 
    clearSession 
  } = useMultiAgentStream()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isStreaming) return
    
    await sendMessage(inputValue)
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Summon Experts AutoGen Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Multi-agent AI collaboration powered by Microsoft AutoGen
        </p>
        {sessionId && (
          <Badge variant="secondary" className="text-xs">
            Session: {sessionId.slice(0, 8)}...
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Agent Conversation</span>
            <div className="flex gap-2">
              {isStreaming && (
                <Badge variant="destructive" className="animate-pulse">
                  Streaming...
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSession}
                disabled={isStreaming}
              >
                Clear Session
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>Start a conversation with your AI agents!</p>
                <p className="text-sm mt-2">
                  The Planner will break down your request, and the Writer will provide the final answer.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : message.role === "assistant"
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {message.role === "assistant" && message.name && (
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {message.name}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.timestamp && (
                      <div className="text-xs opacity-70 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg p-3 max-w-[80%]">
                  <div className="font-medium">Error</div>
                  <div>{error}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your AI agents anything..."
              disabled={isStreaming}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isStreaming}
              className="min-w-[100px]"
            >
              {isStreaming ? "Sending..." : "Send"}
            </Button>
            {isStreaming && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={cancelStream}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Powered by Microsoft AutoGen • 
          <a 
            href="https://github.com/microsoft/autogen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline ml-1"
          >
            Learn More
          </a>
        </p>
      </div>
    </div>
  )
}

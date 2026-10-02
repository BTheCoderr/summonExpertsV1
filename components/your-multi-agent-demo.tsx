"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export interface AgentMessage {
  role: "user" | "agent" | "system"
  name?: string
  content: string
  timestamp?: string
}

export interface StreamEvent {
  type: string
  source?: string
  content?: string
  metadata?: Record<string, any>
  timestamp: string
}

export function YourMultiAgentDemo() {
  const [inputValue, setInputValue] = useState("")
  const [teamType, setTeamType] = useState("round-robin")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const sendMessage = async (text: string) => {
    // Add user message immediately
    const userMessage: AgentMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setError(null)
    setIsStreaming(true)

    try {
      const response = await fetch("/api/agent/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId, 
          message: text,
          teamType 
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Get session ID from response headers
      const newSessionId = response.headers.get("x-session-id")
      const teamTypeHeader = response.headers.get("x-team-type")
      
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || "" // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = line.slice(6).trim()
              if (data) {
                const event: StreamEvent = JSON.parse(data)
                
                if (event.type === "error") {
                  setError(event.content || "Unknown error occurred")
                  continue
                }

                if (event.type === "agent_response" && event.source && event.content) {
                  const agentMessage: AgentMessage = {
                    role: "agent",
                    name: event.source,
                    content: event.content,
                    timestamp: event.timestamp || new Date().toISOString()
                  }
                  setMessages(prev => [...prev, agentMessage])
                }
              }
            } catch (parseError) {
              console.warn("Failed to parse SSE data:", parseError)
            }
          } else if (line.startsWith("event: done")) {
            // Stream completed
            setIsStreaming(false)
            return
          }
        }
      }

      setIsStreaming(false)

    } catch (error) {
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")
      setIsStreaming(false)
    }
  }

  const clearSession = async () => {
    // Clear local state
    setMessages([])
    setError(null)
    
    // If we have a session ID, try to delete it from the server
    if (sessionId) {
      try {
        await fetch(`/api/agent/orchestrate?sessionId=${sessionId}&teamType=${teamType}`, {
          method: "DELETE"
        })
      } catch (error) {
        console.warn("Failed to delete session:", error)
      }
      setSessionId(null)
    }
  }

  const getTeamDescription = (type: string) => {
    switch (type) {
      case "round-robin":
        return "Agents take turns responding in sequence"
      case "coordinated":
        return "Coordinator selects the best agent for each task"
      default:
        return "Default team configuration"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Your Multi-Agent System
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Built from scratch, learning from AutoGen patterns
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
            <span>Team Configuration</span>
            <div className="flex gap-2">
              <Select value={teamType} onValueChange={(value) => {
                if (value !== teamType) {
                  clearSession() // Clear session when switching team types
                }
                setTeamType(value)
              }}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select team type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round-robin">Round Robin Team</SelectItem>
                  <SelectItem value="coordinated">Coordinated Team</SelectItem>
                  <SelectItem value="research">Research Team</SelectItem>
                  <SelectItem value="creative">Creative Team</SelectItem>
                  <SelectItem value="innovation">Innovation Team</SelectItem>
                </SelectContent>
              </Select>
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
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getTeamDescription(teamType)}
            </p>
            <div className="text-xs text-gray-500">
              <strong>Round Robin:</strong> Planner → Executor → Writer (sequential)
              <br />
              <strong>Coordinated:</strong> Coordinator selects best agent for each task
            </div>
          </div>
        </CardContent>
      </Card>

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
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>Start a conversation with your AI agents!</p>
                <p className="text-sm mt-2">
                  Try asking about planning a trip, business strategy, or any complex task.
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
                        : message.role === "agent"
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {message.role === "agent" && message.name && (
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
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Built with your own orchestrator • 
          <span className="text-green-600 ml-1">
            Learning from AutoGen, implemented your way
          </span>
        </p>
      </div>
    </div>
  )
}

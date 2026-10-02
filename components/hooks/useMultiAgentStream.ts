import { useEffect, useRef, useState, useCallback } from "react"

export interface AgentMessage {
  role: "user" | "assistant" | "system"
  name?: string
  content: string
  timestamp?: string
}

export interface StreamEvent {
  type: string
  source?: string
  content?: string
  timestamp?: string
}

export function useMultiAgentStream() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Clean up function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  // Send message and handle streaming response
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    // Clean up any existing stream
    cleanup()

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
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()

      const response = await fetch("/api/agent/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Get session ID from response headers
      const newSessionId = response.headers.get("x-session-id")
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

                // Handle text messages from agents
                if (event.content && event.source) {
                  const agentMessage: AgentMessage = {
                    role: "assistant",
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
      if (error instanceof Error && error.name === "AbortError") {
        // Request was cancelled, this is expected
        return
      }
      
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")
      setIsStreaming(false)
    }
  }, [sessionId, cleanup])

  // Cancel current stream
  const cancelStream = useCallback(() => {
    cleanup()
  }, [cleanup])

  // Clear messages and session
  const clearSession = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setError(null)
    cleanup()
  }, [cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    sessionId,
    messages,
    isStreaming,
    error,
    sendMessage,
    cancelStream,
    clearSession
  }
}

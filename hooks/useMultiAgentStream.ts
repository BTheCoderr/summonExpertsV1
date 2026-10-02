import { useRef, useState } from "react"

export interface ChatMessage {
  role: "assistant" | "user" | "system"
  name?: string
  content: string
}

export function useMultiAgentStream() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const inflight = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

  function append(m: ChatMessage) {
    setMessages((prev) => [...prev, m])
  }

  async function sendMessage(text: string) {
    append({ role: "user", content: text })
    const res = await fetch("/api/agent/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: text }),
    })
    const sid = res.headers.get("x-session-id")
    if (sid && sid !== sessionId) setSessionId(sid)
    const reader = res.body?.getReader()
    if (!reader) return
    inflight.current = reader

    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const chunks = buffer.split("\n\n")
      buffer = chunks.pop() ?? ""
      for (const chunk of chunks) {
        if (!chunk.startsWith("data:")) continue
        const raw = chunk.slice(5).trim()
        if (!raw) continue
        const payload = JSON.parse(raw)
        const t = (payload.type || "").toLowerCase()
        if (t.includes("text")) {
          append({
            role: "assistant",
            name: payload.source ?? "Agent",
            content: payload.content ?? "",
          })
        } else if (payload.type === "tool") {
          append({ role: "system", content: `🛠 ${payload.content ?? "tool activity"}` })
        } else if (payload.type === "error") {
          append({ role: "system", content: `error ${payload.message}` })
        }
      }
    }
    inflight.current = null
  }

  return { sessionId, messages, sendMessage }
}

"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, MessageSquare, Loader2 } from 'lucide-react'

export interface ChatMessage {
  role: "assistant" | "user" | "system"
  name?: string
  content: string
}

interface AgentChatProps {
  messages: ChatMessage[]
  isLoading: boolean
  phase: string
}

export default function AgentChat({ messages, isLoading, phase }: AgentChatProps) {
  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'okr': return '🎯'
      case 'market': return '📊'
      case 'strategy': return '🧠'
      case 'roadmap': return '🗺️'
      default: return '🤖'
    }
  }

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case 'okr': return 'OKR Generation'
      case 'market': return 'Market Analysis'
      case 'strategy': return 'Strategy Development'
      case 'roadmap': return 'Roadmap Creation'
      default: return 'Agent Collaboration'
    }
  }

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="w-5 h-5 mr-2 text-teal-400" />
          {getPhaseIcon(phase)} {getPhaseTitle(phase)}
          {isLoading && (
            <Loader2 className="w-4 h-4 ml-2 animate-spin text-teal-400" />
          )}
        </CardTitle>
        <p className="text-sm text-gray-400">
          AI agents are collaborating to create your strategic plan...
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Agents will appear here as they work on your plan...</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : message.role === 'system'
                    ? 'bg-yellow-500/20 border border-yellow-500/30'
                    : 'bg-gray-700/50 border border-gray-600/30'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                        U
                      </div>
                    ) : message.role === 'system' ? (
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs text-white">
                        ⚠️
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-xs text-white">
                        {message.name ? message.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-300 mb-1">
                      {message.role === 'user' 
                        ? 'You' 
                        : message.role === 'system'
                        ? 'System'
                        : message.name || 'Agent'
                      }
                    </div>
                    <div className="text-sm text-gray-200 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-teal-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Agents are thinking...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

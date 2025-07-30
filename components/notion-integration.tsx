'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Brain, Sparkles, Loader2, Send, Copy, Check } from 'lucide-react'

interface NotionIntegrationProps {
  pageId?: string
  initialPrompt?: string
  onResponse?: (response: string) => void
}

export function NotionIntegration({ 
  pageId, 
  initialPrompt = '', 
  onResponse 
}: NotionIntegrationProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAI, setSelectedAI] = useState<'claude' | 'gpt'>('claude')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setResponse('')

    try {
      // First, get AI response
      const aiResponse = await fetch(`/api/${selectedAI}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      })

      const aiData = await aiResponse.json()
      
      if (aiData.error) {
        throw new Error(aiData.error)
      }

      // If we have a pageId, create an AI block in Notion
      if (pageId) {
        await fetch('/api/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-ai-block',
            pageId,
            content: aiData.result,
            prompt: prompt.trim()
          })
        })
      }

      setResponse(aiData.result)
      onResponse?.(aiData.result)

    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const quickPrompts = [
    'Summarize this page',
    'Generate action items',
    'Explain the key concepts',
    'Create a to-do list',
    'Brainstorm ideas'
  ]

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center animate-float">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">AI Assistant</span>
        </div>
        
        {/* AI Model Selector */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedAI('claude')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedAI === 'claude' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Claude
          </button>
          <button
            onClick={() => setSelectedAI('gpt')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedAI === 'gpt' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            GPT-4o
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick prompts:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt) => (
            <button
              key={quickPrompt}
              onClick={() => setPrompt(quickPrompt)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to help with this page..."
            className="pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Response */}
      {response && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 animate-float-delayed">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin-slow" />
              <span className="text-sm font-medium text-gray-900">AI Response</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </Button>
          </div>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {response}
          </div>
          {pageId && (
            <div className="mt-3 text-xs text-gray-500">
              ✓ Response saved to Notion page
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="flex items-center space-x-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin-slow" />
            <span>AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  )
} 
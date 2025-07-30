'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Copy, Trash2, Clock, CheckCircle } from 'lucide-react'

interface Result {
  id: string
  title: string
  content: string
  timestamp: Date
}

interface ResultsPanelProps {
  results: Result[]
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full">
      {results.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FileText className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p>No results yet</p>
            <p className="text-sm mt-1">Execute commands to see results here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{result.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(result.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(result.content, result.id)}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    {copiedId === result.id ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-medium leading-relaxed">
                  {result.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
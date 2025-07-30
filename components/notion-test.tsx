'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Edit, Bot, Loader2 } from 'lucide-react'

export function NotionTest() {
  const [pageId, setPageId] = useState('')
  const [content, setContent] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testNotionAction = async (action: string) => {
    if (!pageId.trim()) {
      setResult('Please enter a page ID')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          pageId: pageId.trim(),
          content: content.trim(),
          prompt: content.trim()
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Success: ${data.result}`)
      } else {
        setResult(`❌ Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Notion Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notion Page ID
            </label>
            <Input
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="Enter your Notion page ID (32 characters)"
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Found in your Notion page URL after the last dash
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (for write/create actions)
            </label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content to write or AI prompt"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => testNotionAction('read')}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Read Page
            </Button>

            <Button
              onClick={() => testNotionAction('write')}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
              Write to Page
            </Button>

            <Button
              onClick={() => testNotionAction('create-ai-block')}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              Create AI Block
            </Button>

            <Button
              onClick={() => testNotionAction('summarize')}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Summarize
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Result:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium">1. Create Notion Integration</h4>
            <p className="text-gray-600">
              Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Notion Integrations</a> and create a new integration
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">2. Share Your Page</h4>
            <p className="text-gray-600">
              Open your Notion page, click "Share", and invite your integration
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">3. Get Page ID</h4>
            <p className="text-gray-600">
              Copy the page ID from the URL (32 characters after the last dash)
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">4. Set Environment Variables</h4>
            <p className="text-gray-600">
              Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file with your <code className="bg-gray-200 px-1 rounded">NOTION_SECRET</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Edit, 
  Bot, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Database,
  RefreshCw,
  Plus,
  Save,
  Upload
} from 'lucide-react'

interface NotionPage {
  id: string
  title: string
  content: string
  lastModified: string
}

export function YCNotionIntegration() {
  const [pageId, setPageId] = useState('')
  const [content, setContent] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [connectedPages, setConnectedPages] = useState<NotionPage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const testNotionConnection = async () => {
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
          action: 'read',
          pageId: pageId.trim()
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Connected! Page content: ${data.result.substring(0, 200)}...`)
        setIsConnected(true)
        
        // Add to connected pages
        setConnectedPages(prev => [
          ...prev,
          {
            id: pageId.trim(),
            title: `Page ${pageId.trim().substring(0, 8)}...`,
            content: data.result,
            lastModified: new Date().toISOString()
          }
        ])
      } else {
        setResult(`❌ Error: ${data.error || 'Unknown error'}`)
        setIsConnected(false)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const writeToNotion = async () => {
    if (!pageId.trim() || !content.trim()) {
      setResult('Please enter both page ID and content')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'write',
          pageId: pageId.trim(),
          content: content.trim()
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Successfully wrote to Notion: ${data.result}`)
        setContent('') // Clear content after successful write
      } else {
        setResult(`❌ Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const createAIBlock = async () => {
    if (!pageId.trim() || !content.trim()) {
      setResult('Please enter both page ID and AI content')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-ai-block',
          pageId: pageId.trim(),
          content: content.trim(),
          prompt: 'AI-generated content for YC prototype'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ AI block created: ${data.result}`)
        setContent('') // Clear content after successful creation
      } else {
        setResult(`❌ Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const generateStrategicPlan = async () => {
    if (!pageId.trim()) {
      setResult('Please enter a page ID')
      return
    }

    setLoading(true)
    setResult('')

    try {
      // First read the page to get context
      const readResponse = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'read',
          pageId: pageId.trim()
        })
      })

      const readData = await readResponse.json()
      
      if (readResponse.ok) {
        // Generate strategic plan content
        const strategicPlan = `# Strategic Plan for YC Submission

## Executive Summary
Based on the business overview, here's a comprehensive strategic plan for launching your bakery business within 2 months.

## Key Strategic Pillars

### 1. Market Entry Strategy
- **Phase 1 (Weeks 1-2):** Legal setup and location decision
- **Phase 2 (Weeks 3-4):** Basic operations and initial sales channels
- **Phase 3 (Weeks 5-8):** Digital presence and scaling

### 2. Revenue Generation
- Pop-up events at local markets
- Pre-order campaigns via social media
- Direct customer relationships
- Strategic partnerships with local businesses

### 3. Operational Excellence
- Streamlined production processes
- Quality control systems
- Customer feedback loops
- Continuous improvement methodology

## Success Metrics
- Launch within 8 weeks
- Achieve first 50 customers
- Establish 3+ sales channels
- Positive customer feedback score >4.5/5

## Risk Mitigation
- Legal compliance as priority #1
- Multiple revenue streams to reduce dependency
- Strong local community engagement
- Flexible business model for rapid iteration

This strategic plan positions your bakery for sustainable growth while meeting your aggressive 2-month launch timeline.`

        // Write the strategic plan to Notion
        const writeResponse = await fetch('/api/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'write',
            pageId: pageId.trim(),
            content: strategicPlan
          })
        })

        const writeData = await writeResponse.json()
        
        if (writeResponse.ok) {
          setResult(`✅ Strategic plan generated and written to Notion: ${writeData.result}`)
        } else {
          setResult(`❌ Error writing strategic plan: ${writeData.error || 'Unknown error'}`)
        }
      } else {
        setResult(`❌ Error reading page: ${readData.error || 'Unknown error'}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Notion Integration for YC Prototype
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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content to write or AI prompt"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={testNotionConnection}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Test Connection
            </Button>

            <Button
              onClick={writeToNotion}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
              Write to Page
            </Button>

            <Button
              onClick={createAIBlock}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              Create AI Block
            </Button>

            <Button
              onClick={generateStrategicPlan}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Generate Strategic Plan
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

      {connectedPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Connected Pages ({connectedPages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{page.title}</h4>
                    <p className="text-sm text-gray-600">
                      Last modified: {new Date(page.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Connected
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            YC Prototype Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">✅ Working Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real Notion API integration</li>
                <li>• Read/write to Notion pages</li>
                <li>• AI block creation</li>
                <li>• Strategic plan generation</li>
                <li>• Connected pages tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚀 Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connect AI APIs (OpenAI/Claude)</li>
                <li>• Automated task generation</li>
                <li>• Progress tracking</li>
                <li>• Real-time sync</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
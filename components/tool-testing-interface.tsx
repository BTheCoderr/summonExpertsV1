'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Code, 
  Database, 
  MessageSquare, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Info,
  Zap
} from 'lucide-react'
import { toolExecutor, ToolExecutionResult } from '@/lib/tool-executor'
import { TOOL_REGISTRY, getToolsByCategory } from '@/lib/tool-registry'

export default function ToolTestingInterface() {
  const [selectedTool, setSelectedTool] = useState<string>('')
  const [parameters, setParameters] = useState<string>('{}')
  const [executionResult, setExecutionResult] = useState<ToolExecutionResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'all' | 'database' | 'queue' | 'storage' | 'integration'>('all')

  const categories = [
    { id: 'all', label: 'All Tools', icon: Zap, color: 'bg-blue-500' },
    { id: 'database', label: 'Database', icon: Database, color: 'bg-green-500' },
    { id: 'queue', label: 'Queue', icon: Clock, color: 'bg-purple-500' },
    { id: 'storage', label: 'Storage', icon: FileText, color: 'bg-orange-500' },
    { id: 'integration', label: 'Integrations', icon: MessageSquare, color: 'bg-pink-500' }
  ]

  const getFilteredTools = () => {
    if (activeCategory === 'all') {
      return Object.entries(TOOL_REGISTRY)
    }
    return getToolsByCategory(activeCategory as any).map(tool => [tool.name, tool])
  }

  const handleExecuteTool = async () => {
    if (!selectedTool) return

    setIsExecuting(true)
    setExecutionResult(null)

    try {
      const parsedParams = JSON.parse(parameters)
      const result = await toolExecutor.executeTool(selectedTool, parsedParams)
      setExecutionResult(result)
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: `Parameter parsing error: ${error.message}`,
        executionTime: 0
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName)
    const tool = TOOL_REGISTRY[toolName]
    if (tool) {
      // Pre-fill with example parameters
      setParameters(JSON.stringify(tool.examples[0]?.input || {}, null, 2))
    }
  }

  const getToolIcon = (toolName: string) => {
    if (toolName.startsWith('db')) return Database
    if (toolName.startsWith('queue')) return Clock
    if (toolName.startsWith('storage')) return FileText
    if (toolName.includes('slack') || toolName.includes('notion')) return MessageSquare
    return Code
  }

  const getToolColor = (toolName: string) => {
    if (toolName.startsWith('db')) return 'bg-green-500'
    if (toolName.startsWith('queue')) return 'bg-purple-500'
    if (toolName.startsWith('storage')) return 'bg-orange-500'
    if (toolName.includes('slack') || toolName.includes('notion')) return 'bg-pink-500'
    return 'bg-blue-500'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🛠️ Tool Testing Interface</h1>
        <p className="text-gray-400">Test and execute all available tools directly from the frontend</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'ghost'}
                onClick={() => setActiveCategory(category.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-teal-500/80 text-white shadow-lg backdrop-blur-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool Selection */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-teal-400" />
              Available Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredTools().map(([toolName, tool]: [string, any]) => {
                const Icon = getToolIcon(toolName)
                const color = getToolColor(toolName)
                
                return (
                  <div
                    key={toolName}
                    onClick={() => handleToolSelect(toolName)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTool === toolName
                        ? 'bg-teal-500/20 border border-teal-500/40'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{toolName}</div>
                        <div className="text-gray-400 text-sm">{tool.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tool.parameters.required.length} params
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tool Execution */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="w-5 h-5 mr-2 text-teal-400" />
              Execute Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTool ? (
              <>
                <div>
                  <Label className="text-white">Selected Tool</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getToolColor(selectedTool)}>
                      {selectedTool}
                    </Badge>
                    <span className="text-gray-400 text-sm">
                      {TOOL_REGISTRY[selectedTool]?.description}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-white">Parameters (JSON)</Label>
                  <Textarea
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    placeholder="Enter tool parameters as JSON..."
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                    rows={6}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Required: {TOOL_REGISTRY[selectedTool]?.parameters.required.join(', ')}
                  </div>
                </div>

                <Button
                  onClick={handleExecuteTool}
                  disabled={isExecuting}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                >
                  {isExecuting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Tool
                    </>
                  )}
                </Button>

                {/* Example Parameters */}
                {TOOL_REGISTRY[selectedTool]?.examples && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-300 mb-2">Example Parameters:</div>
                    <pre className="text-xs text-gray-400 overflow-x-auto">
                      {JSON.stringify(TOOL_REGISTRY[selectedTool].examples[0].input, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Code className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>Select a tool from the left to execute it</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Execution Results */}
      {executionResult && (
        <Card className="glass-panel border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {executionResult.success ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 mr-2 text-red-400" />
              )}
              Execution Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {executionResult.success ? 'Success' : 'Failed'}
                </div>
                <div className="text-sm text-gray-400">Status</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {executionResult.executionTime}ms
                </div>
                <div className="text-sm text-gray-400">Execution Time</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {selectedTool}
                </div>
                <div className="text-sm text-gray-400">Tool Executed</div>
              </div>
            </div>

            {executionResult.success ? (
              <div>
                <Label className="text-white">Response Data</Label>
                <pre className="mt-2 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(executionResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <Label className="text-white">Error Details</Label>
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="text-red-400 font-medium">{executionResult.error}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tool Information */}
      <Card className="glass-panel border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-400" />
            Tool Registry Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {Object.keys(TOOL_REGISTRY).length}
              </div>
              <div className="text-sm text-gray-400">Total Tools</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {getToolsByCategory('database').length}
              </div>
              <div className="text-sm text-gray-400">Database Tools</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {getToolsByCategory('integration').length}
              </div>
              <div className="text-sm text-gray-400">Integration Tools</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {getToolsByCategory('storage').length + getToolsByCategory('queue').length}
              </div>
              <div className="text-sm text-gray-400">Utility Tools</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

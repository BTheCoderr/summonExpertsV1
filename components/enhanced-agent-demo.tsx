'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Users, 
  TrendingUp, 
  Target, 
  FileText, 
  BarChart3,
  Play,
  Stop,
  RotateCcw,
  MessageSquare,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { SummonExpertsAgentFactory } from '@/lib/agents/summon-experts-agents'

interface AgentDemo {
  id: string
  name: string
  type: string
  status: 'idle' | 'running' | 'completed' | 'error'
  messages: any[]
  result?: any
  error?: string
}

export default function EnhancedAgentDemo() {
  const [activeAgents, setActiveAgents] = useState<AgentDemo[]>([])
  const [selectedAgentType, setSelectedAgentType] = useState<string>('')
  const [agentInput, setAgentInput] = useState<string>('')
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)

  const agentTypes = [
    {
      type: 'business-planner',
      name: 'Business Planner',
      description: 'Strategic planning and business model development',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      type: 'market-analyst',
      name: 'Market Analyst',
      description: 'Market research and competitive analysis',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      type: 'finance-expert',
      name: 'Finance Expert',
      description: 'Financial planning and projections',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      type: 'execution-agent',
      name: 'Execution Agent',
      description: 'Project management and task execution',
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      type: 'growth-agent',
      name: 'Growth Agent',
      description: 'Growth strategy and optimization',
      icon: Zap,
      color: 'bg-pink-500'
    }
  ]

  const createAgent = async () => {
    if (!selectedAgentType || !agentInput.trim()) return

    setIsCreatingAgent(true)
    
    try {
      let agent: any
      const agentId = `agent_${Date.now()}`

      switch (selectedAgentType) {
        case 'business-planner':
          agent = SummonExpertsAgentFactory.createBusinessPlanner()
          break
        case 'market-analyst':
          agent = SummonExpertsAgentFactory.createMarketAnalyst()
          break
        case 'finance-expert':
          agent = SummonExpertsAgentFactory.createFinanceExpert()
          break
        case 'execution-agent':
          agent = SummonExpertsAgentFactory.createExecutionAgent()
          break
        case 'growth-agent':
          agent = SummonExpertsAgentFactory.createGrowthAgent()
          break
        default:
          throw new Error('Unknown agent type')
      }

      const newAgent: AgentDemo = {
        id: agentId,
        name: agent.getName(),
        type: selectedAgentType,
        status: 'idle',
        messages: []
      }

      setActiveAgents(prev => [...prev, newAgent])
      setSelectedAgentType('')
      setAgentInput('')
    } catch (error: any) {
      console.error('Failed to create agent:', error)
    } finally {
      setIsCreatingAgent(false)
    }
  }

  const runAgent = async (agentId: string) => {
    setActiveAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'running' }
          : agent
      )
    )

    try {
      const agent = activeAgents.find(a => a.id === agentId)
      if (!agent) return

      // Simulate agent execution
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate different results based on agent type
      let result: any
      switch (agent.type) {
        case 'business-planner':
          result = {
            project_id: `project_${Date.now()}`,
            plan_document: { url: 'https://storage.example.com/strategic-plan.md' },
            project_structure: { milestone_ids: ['milestone_1'], task_ids: ['task_1', 'task_2'] }
          }
          break
        case 'market-analyst':
          result = {
            research_id: `research_${Date.now()}`,
            research_document: { url: 'https://storage.example.com/market-research.md' },
            status: 'completed'
          }
          break
        case 'finance-expert':
          result = {
            finance_id: `finance_${Date.now()}`,
            financial_plan: { url: 'https://storage.example.com/financial-plan.md' },
            status: 'created'
          }
          break
        case 'execution-agent':
          result = {
            execution_plan: { milestone_ids: ['milestone_1'], task_ids: ['task_1'] },
            execution_guide: { url: 'https://storage.example.com/execution-guide.md' }
          }
          break
        case 'growth-agent':
          result = {
            growth_id: `growth_${Date.now()}`,
            growth_strategy: { url: 'https://storage.example.com/growth-strategy.md' }
          }
          break
        default:
          result = { message: 'Agent execution completed' }
      }

      setActiveAgents(prev => 
        prev.map(a => 
          a.id === agentId 
            ? { 
                ...a, 
                status: 'completed', 
                result,
                messages: [...a.messages, { role: 'assistant', content: 'Task completed successfully!' }]
              }
            : a
        )
      )
    } catch (error: any) {
      setActiveAgents(prev => 
        prev.map(a => 
          a.id === agentId 
            ? { ...a, status: 'error', error: error.message }
            : a
        )
      )
    }
  }

  const resetAgent = (agentId: string) => {
    setActiveAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'idle', messages: [], result: undefined, error: undefined }
          : agent
      )
    )
  }

  const removeAgent = (agentId: string) => {
    setActiveAgents(prev => prev.filter(agent => agent.id !== agentId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'running':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-500'
      case 'running':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🚀 Enhanced Agent System Demo</h1>
        <p className="text-gray-400">Experience our advanced multi-agent collaboration system</p>
      </div>

      {/* Agent Creation */}
      <Card className="glass-panel border-white/10 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bot className="w-5 h-5 mr-2 text-teal-400" />
            Create New Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Agent Type</Label>
              <select
                value={selectedAgentType}
                onChange={(e) => setSelectedAgentType(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Select agent type...</option>
                {agentTypes.map(type => (
                  <option key={type.type} value={type.type}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-white">Input/Goal</Label>
              <Input
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                placeholder="Enter business goal or task..."
                className="mt-1 bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <Button
            onClick={createAgent}
            disabled={!selectedAgentType || !agentInput.trim() || isCreatingAgent}
            className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
          >
            {isCreatingAgent ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Create Agent
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Active Agents */}
      {activeAgents.length > 0 && (
        <Card className="glass-panel border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-teal-400" />
              Active Agents ({activeAgents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAgents.map(agent => {
                const agentType = agentTypes.find(t => t.type === agent.type)
                const Icon = agentType?.icon || Bot
                const color = agentType?.color || 'bg-gray-500'
                
                return (
                  <div
                    key={agent.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{agent.name}</div>
                          <div className="text-gray-400 text-sm">{agentType?.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(agent.status)} text-white`}>
                          {getStatusIcon(agent.status)}
                          <span className="ml-1 capitalize">{agent.status}</span>
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runAgent(agent.id)}
                          disabled={agent.status === 'running'}
                          className="glass-button"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetAgent(agent.id)}
                          className="glass-button"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAgent(agent.id)}
                          className="glass-button text-red-400 hover:text-red-300"
                        >
                          ×
                        </Button>
                      </div>
                    </div>

                    {/* Agent Messages */}
                    {agent.messages.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm text-gray-400 mb-2">Messages:</div>
                        <div className="space-y-2">
                          {agent.messages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded text-sm ${
                                msg.role === 'assistant' 
                                  ? 'bg-blue-500/20 text-blue-200' 
                                  : 'bg-gray-500/20 text-gray-200'
                              }`}
                            >
                              <span className="font-medium">{msg.role}:</span> {msg.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agent Result */}
                    {agent.result && (
                      <div className="mb-3">
                        <div className="text-sm text-gray-400 mb-2">Result:</div>
                        <pre className="p-3 bg-gray-800/50 rounded text-xs text-gray-300 overflow-x-auto">
                          {JSON.stringify(agent.result, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Agent Error */}
                    {agent.error && (
                      <div className="mb-3">
                        <div className="text-sm text-red-400 mb-2">Error:</div>
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-300">
                          {agent.error}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Capabilities */}
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-teal-400" />
            Agent Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentTypes.map(type => {
              const Icon = type.icon
              return (
                <div
                  key={type.type}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color} mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-medium mb-2">{type.name}</h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-white">
            {activeAgents.length}
          </div>
          <div className="text-sm text-gray-400">Active Agents</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-white">
            {activeAgents.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-400">Completed Tasks</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-white">
            {activeAgents.filter(a => a.status === 'running').length}
          </div>
          <div className="text-sm text-gray-400">Running</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-white">
            {activeAgents.filter(a => a.status === 'error').length}
          </div>
          <div className="text-sm text-gray-400">Errors</div>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  CheckCircle2,
  Loader2,
  User,
  Building,
  ArrowRight,
  Brain
} from 'lucide-react'

type Phase = "collect" | "okr" | "market" | "strategy" | "roadmap" | "complete"

interface PlanInputs {
  // About Founder
  fullName?: string
  email?: string  
  phone?: string
  industryExperience?: string
  expertise?: string
  
  // About Business
  businessName: string
  startMonth?: string
  startYear?: string
  location?: string
  businessDescription?: string
  operationalModel?: string
  serviceOfferings?: string
  
  // Strategic Goals
  vision?: string
  currentStage?: string
  customersPerMonth?: number
  revenuePerMonth?: number
  longTermGoals?: string
  aspirationalGoals?: string
  
  // Weekly Priorities Context  
  revenueGoal90d: number
  customerGoal90d: number
  challenges?: string
  hoursPerWeek: number
}

interface AgentMessage {
  type: "phase_start" | "agent_start" | "agent_message" | "phase_complete" | "error"
  agent?: string
  message?: string
  content?: string
  phase?: string
  data?: any
}

export default function NewStrategicPlanPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentPhase, setCurrentPhase] = useState<Phase>("collect")
  const [isProcessing, setIsProcessing] = useState(false)
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const [planResults, setPlanResults] = useState<any>({})
  
  const [inputs, setInputs] = useState<PlanInputs>({
    businessName: "",
    revenueGoal90d: 25000,
    customerGoal90d: 40, 
    hoursPerWeek: 6
  })

  const phases = [
    { id: 'collect', label: 'Collect Inputs', icon: User, color: 'blue' },
    { id: 'okr', label: 'OKR Planning', icon: Target, color: 'green' },
    { id: 'market', label: 'Market Analysis', icon: BarChart3, color: 'yellow' },
    { id: 'strategy', label: 'Strategy Planning', icon: Brain, color: 'purple' },
    { id: 'roadmap', label: 'Project Roadmap', icon: Calendar, color: 'orange' },
  ]

  const startPlan = async () => {
    setIsProcessing(true)
    setAgentMessages([])
    
    try {
      // Start the plan session
      const response = await fetch('/api/plan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })
      
      if (!response.ok) {
        throw new Error('Failed to start plan')
      }
      
      const result = await response.json()
      setSessionId(result.sessionId)
      setCurrentPhase('okr')
      
      // Start OKR phase
      await runPhase('okr', result.sessionId)
      
    } catch (error) {
      console.error('Error starting plan:', error)
      setAgentMessages(prev => [...prev, {
        type: 'error',
        message: 'Failed to start planning process'
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const runPhase = async (phase: Phase, sid = sessionId) => {
    if (!sid) return
    
    setIsProcessing(true)
    setAgentMessages([])
    
    try {
      const response = await fetch(`/api/plan/run?sid=${sid}&phase=${phase}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream')
      }
      
      const decoder = new TextDecoder()
      let buffer = ''
      
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              setAgentMessages(prev => [...prev, data])
              
              if (data.type === 'phase_complete') {
                setPlanResults(prev => ({
                  ...prev,
                  [data.phase]: data.data
                }))
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e)
            }
          }
        }
      }
      
    } catch (error) {
      console.error(`Error in ${phase} phase:`, error)
      setAgentMessages(prev => [...prev, {
        type: 'error',
        message: `Failed to complete ${phase} phase`
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmPhase = async (phase: string, approved: boolean = true) => {
    if (!sessionId) return
    
    try {
      await fetch('/api/plan/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          phase,
          data: { approved }
        })
      })
      
      // Move to next phase
      const phaseOrder = ['okr', 'market', 'strategy', 'roadmap']
      const currentIndex = phaseOrder.indexOf(phase)
      const nextPhase = phaseOrder[currentIndex + 1]
      
      if (nextPhase) {
        setCurrentPhase(nextPhase as Phase)
        await runPhase(nextPhase as Phase)
      } else {
        setCurrentPhase('complete')
      }
      
    } catch (error) {
      console.error('Error confirming phase:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📋 Strategic Plan Workflow
          </h1>
          <p className="text-xl text-gray-300">
            5-Phase Multi-Agent Strategic Planning Process
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {phases.map((phase, index) => {
              const isActive = currentPhase === phase.id
              const isCompleted = phases.findIndex(p => p.id === currentPhase) > index
              const Icon = phase.icon
              
              return (
                <div key={phase.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isCompleted ? 'bg-green-600 border-green-600' :
                    isActive ? 'bg-blue-600 border-blue-600' :
                    'bg-gray-700 border-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isCompleted ? 'text-green-400' :
                      isActive ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {phase.label}
                    </p>
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-600 mx-4" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <div>
            {currentPhase === 'collect' && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-400" />
                    Phase 1: Collect Business Inputs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* About Founder */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">About Founder</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Full Name</Label>
                        <Input
                          value={inputs.fullName || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, fullName: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Email</Label>
                        <Input
                          type="email"
                          value={inputs.email || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Phone</Label>
                        <Input
                          value={inputs.phone || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Industry Experience</Label>
                        <Input
                          value={inputs.industryExperience || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, industryExperience: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Business */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">About Business</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Business Name *</Label>
                        <Input
                          value={inputs.businessName}
                          onChange={(e) => setInputs(prev => ({ ...prev, businessName: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-300">Start Month</Label>
                          <Input
                            value={inputs.startMonth || ''}
                            onChange={(e) => setInputs(prev => ({ ...prev, startMonth: e.target.value }))}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Start Year</Label>
                          <Input
                            value={inputs.startYear || ''}
                            onChange={(e) => setInputs(prev => ({ ...prev, startYear: e.target.value }))}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Location</Label>
                          <Input
                            value={inputs.location || ''}
                            onChange={(e) => setInputs(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Business Description</Label>
                        <Textarea
                          value={inputs.businessDescription || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, businessDescription: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="What do you do?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Strategic Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Strategic Goals</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Vision (5-year plan)</Label>
                        <Textarea
                          value={inputs.vision || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, vision: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="Where should you be in 5 years?"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Revenue Goal (90 days) *</Label>
                          <Input
                            type="number"
                            value={inputs.revenueGoal90d}
                            onChange={(e) => setInputs(prev => ({ ...prev, revenueGoal90d: Number(e.target.value) }))}
                            className="bg-gray-800/50 border-gray-600 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Customer Goal (90 days) *</Label>
                          <Input
                            type="number"
                            value={inputs.customerGoal90d}
                            onChange={(e) => setInputs(prev => ({ ...prev, customerGoal90d: Number(e.target.value) }))}
                            className="bg-gray-800/50 border-gray-600 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Weekly Availability (hours) *</Label>
                        <Input
                          type="number"
                          value={inputs.hoursPerWeek}
                          onChange={(e) => setInputs(prev => ({ ...prev, hoursPerWeek: Number(e.target.value) }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Ongoing Challenges</Label>
                        <Textarea
                          value={inputs.challenges || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, challenges: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="What challenges do you face?"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={startPlan}
                    disabled={!inputs.businessName || !inputs.revenueGoal90d || !inputs.customerGoal90d || !inputs.hoursPerWeek || isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Starting AI Planning...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Start Strategic Planning
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* OKR Phase */}
            {currentPhase === 'okr' && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    Phase 2: OKR Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    AI agents are creating your 90-day Objectives and Key Results...
                  </p>
                  {!isProcessing && planResults.okr && (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Generated OKRs</h4>
                        <div className="text-gray-300 text-sm">
                          {/* Display OKR results here */}
                          <p>OKRs have been generated and reviewed by the coaching agent.</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => confirmPhase('okr', true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Yes, looks good
                        </Button>
                        <Button 
                          onClick={() => runPhase('okr')}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Market Phase */}
            {currentPhase === 'market' && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                    Phase 3: Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Market analyst is researching opportunities for your business...
                  </p>
                  {!isProcessing && planResults.market && (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Market Insights</h4>
                        <div className="text-gray-300 text-sm">
                          <p>Market analysis complete with growth opportunities identified.</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => confirmPhase('market', true)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Use these insights
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Strategy Phase */}
            {currentPhase === 'strategy' && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    Phase 4: Strategy Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Strategy agents are creating your execution plan...
                  </p>
                  {!isProcessing && planResults.strategy && (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Strategic Plan</h4>
                        <div className="text-gray-300 text-sm">
                          <p>Strategic initiatives have been prioritized and reviewed.</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => confirmPhase('strategy', true)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Approve plan
                        </Button>
                        <Button 
                          onClick={() => runPhase('strategy')}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          Request changes
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Roadmap Phase */}
            {currentPhase === 'roadmap' && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-400" />
                    Phase 5: Project Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Project manager is creating your 90-day roadmap...
                  </p>
                  {!isProcessing && planResults.roadmap && (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">90-Day Roadmap</h4>
                        <div className="text-gray-300 text-sm">
                          <p>Your strategic plan is now complete with a detailed roadmap!</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setCurrentPhase('complete')}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Complete Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Complete Phase */}
            {currentPhase === 'complete' && (
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                    Strategic Plan Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Your 90-Day Strategic Plan is Ready!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Your multi-agent team has successfully created a comprehensive strategic plan.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    View Complete Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Agent Activity Panel */}
          <div>
            <Card className="glass-panel border-white/10 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-teal-400" />
                  Multi-Agent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {agentMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Agents will appear here as they work on your plan...</p>
                    </div>
                  ) : (
                    agentMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.type === 'error' ? 'bg-red-500/20 border border-red-500/30' :
                          message.type === 'phase_start' ? 'bg-blue-500/20 border border-blue-500/30' :
                          message.type === 'agent_start' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                          message.type === 'phase_complete' ? 'bg-green-500/20 border border-green-500/30' :
                          'bg-gray-700/50 border border-gray-600/30'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                              message.type === 'error' ? 'bg-red-500' :
                              message.type === 'phase_start' ? 'bg-blue-500' :
                              message.type === 'agent_start' ? 'bg-yellow-500' :
                              message.type === 'phase_complete' ? 'bg-green-500' :
                              'bg-teal-500'
                            }`}>
                              {message.agent ? message.agent.charAt(0).toUpperCase() : '🤖'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-300 mb-1">
                              {message.agent || 'System'}
                            </div>
                            <div className="text-sm text-gray-200 whitespace-pre-wrap">
                              {message.content || message.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {isProcessing && (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-teal-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Agents are working...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

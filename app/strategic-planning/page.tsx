'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Brain, BarChart3, Calendar, Loader2 } from 'lucide-react'
import { useMultiAgentStream } from '@/hooks/useMultiAgentStream'
import AgentChat from '@/components/AgentChat'

export default function StrategicPlanningPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    revenueGoal: '',
    customerGoal: '',
    availability: ''
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('inputs')
  const { messages, sendMessage } = useMultiAgentStream()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setCurrentPhase('processing')

    const prompt = `Create a 90-day strategic plan for:
Business: ${formData.businessName}
Industry: ${formData.industry}
Revenue Goal: $${formData.revenueGoal}
Customer Goal: ${formData.customerGoal} customers
Availability: ${formData.availability} hours/week

Please provide:
1. OKRs (Objectives and Key Results)
2. Market analysis insights
3. Strategic initiatives
4. 90-day roadmap

Use your multi-agent expertise to create a comprehensive plan.`

    try {
      await sendMessage(prompt)
      setCurrentPhase('complete')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎯 Strategic Planning with AI Agents
          </h1>
          <p className="text-xl text-gray-300">
            Multi-Agent Strategic Planning Workflow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Business Name
                  </label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Business Name"
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Industry
                  </label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., SaaS, Consulting, E-commerce"
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Revenue Goal (90 days)
                    </label>
                    <Input
                      type="number"
                      value={formData.revenueGoal}
                      onChange={(e) => setFormData(prev => ({ ...prev, revenueGoal: e.target.value }))}
                      placeholder="25000"
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Customer Goal (90 days)
                    </label>
                    <Input
                      type="number"
                      value={formData.customerGoal}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerGoal: e.target.value }))}
                      placeholder="50"
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Weekly Availability (hours)
                  </label>
                  <Input
                    type="number"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="20"
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI Agents Working...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Strategic Plan
                    </>
                  )}
                </Button>
              </form>
              
              {/* Phase Indicators */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className={`w-4 h-4 ${currentPhase === 'inputs' ? 'text-blue-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${currentPhase === 'inputs' ? 'text-blue-400' : 'text-gray-600'}`}>
                    Collect Inputs
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className={`w-4 h-4 ${currentPhase === 'processing' ? 'text-yellow-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${currentPhase === 'processing' ? 'text-yellow-400' : 'text-gray-600'}`}>
                    AI Agent Processing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className={`w-4 h-4 ${currentPhase === 'complete' ? 'text-green-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${currentPhase === 'complete' ? 'text-green-400' : 'text-gray-600'}`}>
                    Strategic Plan Ready
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Chat */}
          <AgentChat 
            messages={messages} 
            isLoading={isProcessing}
            phase={currentPhase}
          />
        </div>
      </div>
    </div>
  )
}

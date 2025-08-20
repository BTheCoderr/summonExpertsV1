'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Map,
  BarChart3,
  FileText,
  RefreshCw,
  Play,
  CheckCircle2,
  X
} from 'lucide-react'

type Phase = 'input' | 'okr' | 'market' | 'strategy' | 'roadmap' | 'complete'

interface StrategicPlanData {
  // Phase 1: Inputs
  revenueGoal: string
  customerGoal: string
  challenges: string
  availability: string
  
  // Phase 2: OKRs
  objective: string
  keyResults: string[]
  
  // Phase 3: Market Analysis
  industryTrends: string
  growthOpportunities: string[]
  bestPractices: string
  seasonalOpportunities: string
  competitorActivity: string
  
  // Phase 4: Execution Strategy
  actionPlan: string[]
  lineOfAction: string[]
  dependencies: string[]
  
  // Phase 5: Roadmap
  roadmap: Array<{
    initiative: string
    timeline: string
    dependencies: string
    metric: string
  }>
}

export default function StrategicPlanWorkflow() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('input')
  const [planData, setPlanData] = useState<StrategicPlanData>({
    revenueGoal: '',
    customerGoal: '',
    challenges: '',
    availability: '',
    objective: '',
    keyResults: [],
    industryTrends: '',
    growthOpportunities: [],
    bestPractices: '',
    seasonalOpportunities: '',
    competitorActivity: '',
    actionPlan: [],
    lineOfAction: [],
    dependencies: [],
    roadmap: []
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])

  // Phase 1: Input Collection
  const renderInputPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Phase 1: Define Your 90-Day Goals</h2>
        <p className="text-gray-400">Let's start by understanding your growth objectives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-teal-400" />
              Revenue & Customer Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Revenue Goal (90 days)</label>
              <Input
                type="text"
                placeholder="e.g., $50,000"
                value={planData.revenueGoal}
                onChange={(e) => setPlanData({...planData, revenueGoal: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Customer Goal (90 days)</label>
              <Input
                type="text"
                placeholder="e.g., 100 new customers"
                value={planData.customerGoal}
                onChange={(e) => setPlanData({...planData, customerGoal: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-teal-400" />
              Resources & Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Availability (hours per week)</label>
              <Input
                type="text"
                placeholder="e.g., 20 hours"
                value={planData.availability}
                onChange={(e) => setPlanData({...planData, availability: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Ongoing Challenges (optional)</label>
              <Textarea
                placeholder="What challenges are you currently facing?"
                value={planData.challenges}
                onChange={(e) => setPlanData({...planData, challenges: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={() => handlePhase1Submit()}
          disabled={!planData.revenueGoal || !planData.customerGoal || !planData.availability}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3"
        >
          <Brain className="w-4 h-4 mr-2" />
          Generate Strategic Plan
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // Phase 2: OKR Planning
  const renderOKRPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Phase 2: Your 90-Day OKRs</h2>
        <p className="text-gray-400">AI-generated objectives and key results based on your inputs</p>
      </div>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-teal-400" />
            Strategic Objective
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white text-lg mb-4">
            {planData.objective || "Increase revenue by 40% and acquire 100 new customers within 90 days through strategic marketing and operational improvements"}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-teal-400" />
            Key Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {planData.keyResults.map((kr, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-white">{kr}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => handleOKRRegenerate()}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate OKRs
        </Button>
        <Button
          onClick={() => setCurrentPhase('market')}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
        >
          Looks Good, Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // Phase 3: Market Analysis
  const renderMarketPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Phase 3: Market Analysis</h2>
        <p className="text-gray-400">AI-researched growth opportunities for your business and location</p>
      </div>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-teal-400" />
            Growth Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">Based on your location and business type, here are growth opportunities for the next 90 days. Which do you want to prioritize?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planData.growthOpportunities.map((opportunity, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOpportunities.includes(opportunity)
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => toggleOpportunity(opportunity)}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedOpportunities.includes(opportunity)}
                    onChange={() => toggleOpportunity(opportunity)}
                    className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-white">{opportunity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setCurrentPhase('okr')}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Back to OKRs
        </Button>
        <Button
          onClick={() => setCurrentPhase('strategy')}
          disabled={selectedOpportunities.length === 0}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
        >
          Continue to Strategy
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // Phase 4: Execution Strategy
  const renderStrategyPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Phase 4: Execution Strategy</h2>
        <p className="text-gray-400">Your prioritized plan of action to achieve your 90-day goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="w-5 h-5 mr-2 text-teal-400" />
              Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {planData.actionPlan.map((action, index) => (
                <div key={index} className="p-2 bg-white/5 rounded text-white text-sm">
                  {action}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-teal-400" />
              Line of Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {planData.lineOfAction.map((line, index) => (
                <div key={index} className="p-2 bg-white/5 rounded text-white text-sm">
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <X className="w-5 h-5 mr-2 text-red-400" />
              Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {planData.dependencies.map((dependency, index) => (
                <div key={index} className="p-2 bg-white/5 rounded text-white text-sm">
                  {dependency}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setCurrentPhase('market')}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Back to Market Analysis
        </Button>
        <Button
          onClick={() => setCurrentPhase('roadmap')}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
        >
          Approve & Generate Roadmap
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // Phase 5: Roadmap
  const renderRoadmapPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Phase 5: Project Roadmap</h2>
        <p className="text-gray-400">Your executable roadmap with timelines and dependencies</p>
      </div>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Map className="w-5 h-5 mr-2 text-teal-400" />
            Strategic Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">Initiative</th>
                  <th className="text-left p-3 text-gray-300">Timeline</th>
                  <th className="text-left p-3 text-gray-300">Dependencies</th>
                  <th className="text-left p-3 text-gray-300">Metric</th>
                </tr>
              </thead>
              <tbody>
                {planData.roadmap.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-3 text-white">{item.initiative}</td>
                    <td className="p-3 text-gray-300">{item.timeline}</td>
                    <td className="p-3 text-gray-300">{item.dependencies}</td>
                    <td className="p-3 text-gray-300">{item.metric}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setCurrentPhase('strategy')}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Back to Strategy
        </Button>
        <Button
          onClick={() => setCurrentPhase('complete')}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
        >
          Approve & Complete
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // Complete Phase
  const renderCompletePhase = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-white">Strategic Plan Complete!</h2>
      <p className="text-gray-400">Your 90-day growth plan has been generated and saved</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Button
          onClick={() => setCurrentPhase('input')}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
        <Button
          onClick={() => window.location.href = '/platform'}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          View Current Plan
        </Button>
      </div>
    </div>
  )

  // Event Handlers
  const handlePhase1Submit = async () => {
    setIsProcessing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate sample OKRs
    setPlanData({
      ...planData,
      objective: `Increase revenue by ${Math.round(parseInt(planData.revenueGoal.replace(/[^0-9]/g, '')) * 0.4)}% and acquire ${planData.customerGoal} within 90 days through strategic marketing and operational improvements`,
      keyResults: [
        `Achieve $${planData.revenueGoal} in revenue by end of 90 days`,
        `Acquire ${planData.customerGoal} new customers`,
        `Improve customer acquisition cost by 25%`,
        `Launch 2 new marketing channels`,
        `Optimize conversion rate to 15%`
      ]
    })
    
    setIsProcessing(false)
    setCurrentPhase('okr')
  }

  const handleOKRRegenerate = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate alternative OKRs
    setPlanData({
      ...planData,
      keyResults: [
        `Achieve $${planData.revenueGoal} in revenue by end of 90 days`,
        `Acquire ${planData.customerGoal} new customers`,
        `Reduce customer churn to below 5%`,
        `Increase average order value by 30%`,
        `Establish partnerships with 3 complementary businesses`
      ]
    })
    
    setIsProcessing(false)
  }

  const toggleOpportunity = (opportunity: string) => {
    setSelectedOpportunities(prev => 
      prev.includes(opportunity) 
        ? prev.filter(o => o !== opportunity)
        : [...prev, opportunity]
    )
  }

  // Generate market analysis when entering phase 3
  React.useEffect(() => {
    if (currentPhase === 'market' && planData.growthOpportunities.length === 0) {
      // Simulate AI market research
      setPlanData(prev => ({
        ...prev,
        growthOpportunities: [
          "Expand to neighboring cities through digital marketing",
          "Launch seasonal product line for Q4",
          "Partner with local businesses for cross-promotion",
          "Implement referral program for existing customers",
          "Optimize online presence and SEO strategy"
        ]
      }))
    }
  }, [currentPhase])

  // Generate strategy when entering phase 4
  React.useEffect(() => {
    if (currentPhase === 'strategy' && planData.actionPlan.length === 0) {
      setPlanData(prev => ({
        ...prev,
        actionPlan: [
          "Launch targeted social media campaigns",
          "Implement customer referral program",
          "Optimize website conversion funnel",
          "Develop strategic partnerships",
          "Create content marketing strategy"
        ],
        lineOfAction: [
          "Week 1-2: Setup and preparation",
          "Week 3-6: Launch marketing campaigns",
          "Week 7-10: Optimize and scale",
          "Week 11-12: Measure and adjust"
        ],
        dependencies: [
          "Marketing budget approval",
          "Content creation resources",
          "Partnership agreements",
          "Analytics setup"
        ]
      }))
    }
  }, [currentPhase])

  // Generate roadmap when entering phase 5
  React.useEffect(() => {
    if (currentPhase === 'roadmap' && planData.roadmap.length === 0) {
      setPlanData(prev => ({
        ...prev,
        roadmap: [
          {
            initiative: "Launch Social Media Campaigns",
            timeline: "Week 1-4",
            dependencies: "Budget approval, content creation",
            metric: "Social media engagement +20%"
          },
          {
            initiative: "Implement Referral Program",
            timeline: "Week 2-6",
            dependencies: "Program design, technical setup",
            metric: "Referral conversions +15%"
          },
          {
            initiative: "Website Optimization",
            timeline: "Week 3-8",
            dependencies: "Analytics setup, A/B testing",
            metric: "Conversion rate +25%"
          },
          {
            initiative: "Strategic Partnerships",
            timeline: "Week 4-10",
            dependencies: "Partnership agreements",
            metric: "New customer acquisition +30%"
          }
        ]
      }))
    }
  }, [currentPhase])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Strategic Plan Workflow</h1>
        <p className="text-gray-400">Create a structured 90-day growth plan with AI-powered insights</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {['Inputs', 'OKRs', 'Market', 'Strategy', 'Roadmap'].map((phase, index) => (
            <div key={phase} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= ['input', 'okr', 'market', 'strategy', 'roadmap'].indexOf(currentPhase)
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < ['input', 'okr', 'market', 'strategy', 'roadmap'].indexOf(currentPhase)
                    ? 'bg-teal-500'
                    : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-400">
          Phase {['input', 'okr', 'market', 'strategy', 'roadmap'].indexOf(currentPhase) + 1} of 5
        </div>
      </div>

      {/* Phase Content */}
      {isProcessing ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">AI is analyzing your inputs and generating insights...</p>
        </div>
      ) : (
        <>
          {currentPhase === 'input' && renderInputPhase()}
          {currentPhase === 'okr' && renderOKRPhase()}
          {currentPhase === 'market' && renderMarketPhase()}
          {currentPhase === 'strategy' && renderStrategyPhase()}
          {currentPhase === 'roadmap' && renderRoadmapPhase()}
          {currentPhase === 'complete' && renderCompletePhase()}
        </>
      )}
    </div>
  )
}


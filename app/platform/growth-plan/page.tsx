'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, TrendingUp, Calendar, Users, DollarSign, CheckCircle, ArrowRight } from 'lucide-react'

export default function GrowthPlan() {
  const [formData, setFormData] = useState({
    shortTermGoals: '',
    longTermGoals: '',
    keyMetrics: '',
    marketingStrategy: '',
    competitiveAdvantage: '',
    riskFactors: '',
    fundingNeeds: '',
    timeline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Redirect to dashboard after completion
    window.location.href = '/platform'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Growth Plan</h1>
        <p className="text-gray-400">Define your business growth strategy and milestones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Section */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-teal-400" />
              Business Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Short-term Goals (3-6 months)</label>
              <Textarea
                placeholder="What do you want to achieve in the next 3-6 months?"
                value={formData.shortTermGoals}
                onChange={(e) => setFormData({...formData, shortTermGoals: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Long-term Goals (1-3 years)</label>
              <Textarea
                placeholder="What are your bigger vision and goals for the next 1-3 years?"
                value={formData.longTermGoals}
                onChange={(e) => setFormData({...formData, longTermGoals: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Strategy Section */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-400" />
              Growth Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Key Performance Metrics</label>
              <Textarea
                placeholder="What metrics will you track to measure success?"
                value={formData.keyMetrics}
                onChange={(e) => setFormData({...formData, keyMetrics: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Marketing Strategy</label>
              <Textarea
                placeholder="How will you reach and acquire customers?"
                value={formData.marketingStrategy}
                onChange={(e) => setFormData({...formData, marketingStrategy: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Competitive Analysis */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-teal-400" />
              Competitive Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Competitive Advantage</label>
              <Textarea
                placeholder="What makes you different from competitors?"
                value={formData.competitiveAdvantage}
                onChange={(e) => setFormData({...formData, competitiveAdvantage: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Risk Factors</label>
              <Textarea
                placeholder="What are the main risks to your business?"
                value={formData.riskFactors}
                onChange={(e) => setFormData({...formData, riskFactors: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Planning */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-teal-400" />
              Financial Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Additional Funding Needs</label>
              <Input
                type="text"
                placeholder="e.g., $25,000 for marketing, $50,000 for equipment"
                value={formData.fundingNeeds}
                onChange={(e) => setFormData({...formData, fundingNeeds: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Implementation Timeline</label>
              <Input
                type="text"
                placeholder="e.g., Phase 1: Q1, Phase 2: Q2, etc."
                value={formData.timeline}
                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="glass-panel border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-teal-400" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Set Milestones</h3>
              <p className="text-gray-400 text-sm">Define key dates and deadlines</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Build Team</h3>
              <p className="text-gray-400 text-sm">Identify roles and responsibilities</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Track Progress</h3>
              <p className="text-gray-400 text-sm">Monitor KPIs and adjust strategy</p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3"
            >
              {isSubmitting ? 'Saving Plan...' : 'Complete Growth Plan'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


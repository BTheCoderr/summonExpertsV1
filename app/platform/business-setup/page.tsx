'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, MapPin, Target, Users, DollarSign, ArrowRight } from 'lucide-react'

export default function BusinessSetup() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessIdea: '',
    industry: '',
    location: '',
    targetMarket: '',
    uniqueValue: '',
    revenueModel: '',
    initialInvestment: '',
    timeline: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Business fundamentals' },
    { id: 2, title: 'Market & Value', description: 'Target audience and positioning' },
    { id: 3, title: 'Financials', description: 'Revenue and investment details' }
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Redirect to growth plan after setup
    window.location.href = '/platform/growth-plan'
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Business Name</label>
        <Input
          type="text"
          placeholder="Your Business Name"
          value={formData.businessName}
          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Business Idea</label>
        <Textarea
          placeholder="Describe your business idea in detail..."
          value={formData.businessIdea}
          onChange={(e) => setFormData({...formData, businessIdea: e.target.value})}
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Industry</label>
          <Input
            type="text"
            placeholder="e.g., Food & Beverage, Tech, Healthcare"
            value={formData.industry}
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Location</label>
          <Input
            type="text"
            placeholder="City, State or Country"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Target Market</label>
        <Textarea
          placeholder="Who are your ideal customers? Describe their demographics, needs, and pain points..."
          value={formData.targetMarket}
          onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Unique Value Proposition</label>
        <Textarea
          placeholder="What makes your business different? What unique value do you provide?"
          value={formData.uniqueValue}
          onChange={(e) => setFormData({...formData, uniqueValue: e.target.value})}
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
          required
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">Revenue Model</label>
        <Input
          type="text"
          placeholder="e.g., Subscription, One-time sales, Freemium, etc."
          value={formData.revenueModel}
          onChange={(e) => setFormData({...formData, revenueModel: e.target.value})}
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Initial Investment Needed</label>
          <Input
            type="text"
            placeholder="e.g., $10,000, $50,000"
            value={formData.initialInvestment}
            onChange={(e) => setFormData({...formData, initialInvestment: e.target.value})}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Timeline to Launch</label>
          <Input
            type="text"
            placeholder="e.g., 3 months, 6 months, 1 year"
            value={formData.timeline}
            onChange={(e) => setFormData({...formData, timeline: e.target.value})}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            required
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Business Setup</h1>
        <p className="text-gray-400">Configure your business profile and strategic foundation</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-teal-500 border-teal-500 text-white' 
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}>
                {step.id}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-px mx-4 ${
                  currentStep > step.id ? 'bg-teal-500' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building className="w-5 h-5 mr-2 text-teal-400" />
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex items-center justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                >
                  {isSubmitting ? 'Setting Up...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


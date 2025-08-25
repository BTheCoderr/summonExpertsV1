"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { PlanInputsType } from "@/lib/schemas/strategic-plan"

export function StrategicPlanningDemo() {
  const [step, setStep] = useState(1)
  const [planInputs, setPlanInputs] = useState<Partial<PlanInputsType>>({
    revenueGoal90d: 30000,
    customerGoal90d: 60,
    challenges: [],
    availabilityHrsPerWeek: 20,
    business: {
      name: "",
      industry: "",
      location: { country: "US" }
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: any) => {
    setPlanInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBusinessChange = (field: string, value: any) => {
    setPlanInputs(prev => ({
      ...prev,
      business: {
        ...prev.business!,
        [field]: value
      }
    }))
  }

  const handleLocationChange = (field: string, value: any) => {
    setPlanInputs(prev => ({
      ...prev,
      business: {
        ...prev.business!,
        location: {
          ...prev.business!.location,
          [field]: value
        }
      }
    }))
  }

  const handleSubmit = async () => {
    if (!planInputs.business?.name || !planInputs.business?.industry) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("/api/plans?autoDraftOkrs=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planInputs)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPlan(data.plan)
      setStep(2)
    } catch (error) {
      console.error("Error creating plan:", error)
      setError(error instanceof Error ? error.message : "Failed to create plan")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Plan Inputs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Revenue Goal (90 days)</label>
            <Input
              type="number"
              value={planInputs.revenueGoal90d}
              onChange={(e) => handleInputChange("revenueGoal90d", parseInt(e.target.value))}
              placeholder="30000"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Customer Goal (90 days)</label>
            <Input
              type="number"
              value={planInputs.customerGoal90d}
              onChange={(e) => handleInputChange("customerGoal90d", parseInt(e.target.value))}
              placeholder="60"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Availability (hours/week)</label>
          <Input
            type="number"
            value={planInputs.availabilityHrsPerWeek}
            onChange={(e) => handleInputChange("availabilityHrsPerWeek", parseInt(e.target.value))}
            placeholder="20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={planInputs.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={planInputs.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Business Name</label>
          <Input
            value={planInputs.business?.name}
            onChange={(e) => handleBusinessChange("name", e.target.value)}
            placeholder="Your Business Name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Industry</label>
          <Select 
            value={planInputs.business?.industry} 
            onValueChange={(value) => handleBusinessChange("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Services">Services</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Country</label>
            <Select 
              value={planInputs.business?.location?.country} 
              onValueChange={(value) => handleLocationChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={planInputs.business?.location?.state}
              onChange={(e) => handleLocationChange("state", e.target.value)}
              placeholder="CA"
            />
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={planInputs.business?.location?.city}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              placeholder="San Francisco"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Challenges (optional)</label>
          <Textarea
            value={planInputs.challenges?.join(", ")}
            onChange={(e) => handleInputChange("challenges", e.target.value.split(", ").filter(s => s.trim()))}
            placeholder="Low lead volume, Inconsistent follow up, Limited resources"
            rows={3}
          />
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? "Creating Plan..." : "Create Strategic Plan"}
        </Button>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>✅ Plan Created Successfully!</span>
            <Badge variant="secondary">{plan?.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Plan Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plan?.title}
              </p>
            </div>
            
            {plan?.okr && (
              <div>
                <h3 className="font-semibold">OKR Plan</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2">
                  <p className="font-medium">{plan.okr.objective}</p>
                  <div className="mt-3 space-y-2">
                    {plan.okr.keyResults.map((kr: any, index: number) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">• {kr.description}:</span> {kr.target}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline">Focus: {plan.okr.focus}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)}
        >
          Back to Inputs
        </Button>
        <Button 
          onClick={() => {
            setPlan(null)
            setStep(1)
          }}
        >
          Create New Plan
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Strategic Planning Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Multi-agent strategic planning powered by your orchestrator
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span>Plan Inputs</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-200"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span>OKR Review</span>
        </div>
      </div>

      {step === 1 ? renderStep1() : renderStep2()}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Powered by your Multi-Agent Orchestrator • 
          <span className="text-purple-600 ml-1">
            Strategic planning with AI agents
          </span>
        </p>
      </div>
    </div>
  )
}

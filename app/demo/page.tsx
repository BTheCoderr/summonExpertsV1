'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Map, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Edit3, 
  Rocket,
  MoreVertical,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Home,
  FileText,
  Settings,
  Zap,
  Upload,
  X,
  Calendar as CalendarIcon,
  Zap as ZapIcon,
  Loader2,
  Bot,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  Lightbulb,
  Target as TargetIcon,
  Brain,
  Cpu,
  Database,
  Globe,
  BarChart,
  PieChart,
  Activity,
  TrendingDown,
  DollarSign as DollarIcon,
  UserCheck,
  Shield,
  Zap as LightningIcon
} from 'lucide-react'

type TabType = 'overview' | 'roadmap' | 'weekly-tasks' | 'progress-audit'

interface AIModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  messages: string[]
  onComplete: () => void
  type: 'strategic-plan' | 'roadmap' | 'tasks'
}

function AIModal({ isOpen, onClose, title, messages, onComplete, type }: AIModalProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [aiMetrics, setAiMetrics] = useState({
    accuracy: 0,
    confidence: 0,
    processingPower: 0,
    dataPoints: 0
  })

  // Simulate AI processing with enhanced metrics
  React.useEffect(() => {
    if (!isOpen) return

    if (currentMessageIndex < messages.length) {
      const timer = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1)
        // Update AI metrics as processing progresses
        setAiMetrics({
          accuracy: Math.min(95, 70 + (currentMessageIndex + 1) * 4),
          confidence: Math.min(98, 65 + (currentMessageIndex + 1) * 5),
          processingPower: Math.min(100, 40 + (currentMessageIndex + 1) * 10),
          dataPoints: Math.min(2500, 500 + (currentMessageIndex + 1) * 300)
        })
      }, 1200 + Math.random() * 800) // Slightly faster for better UX
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => {
        setIsComplete(true)
        setAiMetrics({
          accuracy: 96,
          confidence: 98,
          processingPower: 100,
          dataPoints: 2500
        })
      }, 800)
    }
  }, [currentMessageIndex, messages.length, isOpen])

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentMessageIndex(0)
      setIsComplete(false)
      setShowResults(false)
      setAiMetrics({
        accuracy: 70,
        confidence: 65,
        processingPower: 40,
        dataPoints: 500
      })
    }
  }, [isOpen])

  const handleComplete = () => {
    setShowResults(true)
  }

  const handleClose = () => {
    setIsComplete(false)
    setCurrentMessageIndex(0)
    setShowResults(false)
    onComplete()
    onClose()
  }

  if (!isOpen) return null

  const renderResults = () => {
    switch (type) {
      case 'strategic-plan':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-lg">Strategic Plan Generated</h4>
                  <p className="text-blue-700 text-sm">AI-Powered Business Strategy</p>
                </div>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                Your comprehensive business strategy has been created and saved to Notion. 
                The plan includes advanced market analysis, competitive positioning, and execution roadmap.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-green-900">Market Analysis</h5>
                </div>
                <p className="text-green-700 text-sm mb-2">Providence bakery market researched</p>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Activity className="w-3 h-3" />
                  <span>2,500+ data points analyzed</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-blue-900">Strategic Priorities</h5>
                </div>
                <p className="text-blue-700 text-sm mb-2">5 key priorities identified</p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <BarChart className="w-3 h-3" />
                  <span>98% confidence score</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-purple-900">Execution Framework</h5>
                </div>
                <p className="text-purple-700 text-sm mb-2">2-month launch timeline created</p>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Optimized for success</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <DollarIcon className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-orange-900">Revenue Projections</h5>
                </div>
                <p className="text-orange-700 text-sm mb-2">$45K first year estimate</p>
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Conservative growth model</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h5 className="font-semibold text-gray-900">AI Confidence Metrics</h5>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="ml-2 font-semibold text-green-600">{aiMetrics.accuracy}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="ml-2 font-semibold text-blue-600">{aiMetrics.confidence}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Next Steps:</strong> Review the strategic plan in your Notion workspace and begin implementing the roadmap.
              </p>
            </div>
          </div>
        )

      case 'roadmap':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-xl border border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-lg">Roadmap Created</h4>
                  <p className="text-green-700 text-sm">AI-Optimized Execution Timeline</p>
                </div>
              </div>
              <p className="text-green-800 text-sm leading-relaxed">
                Your detailed execution timeline has been generated with 4 major milestones and 12 key results, 
                optimized for maximum efficiency and success probability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-green-900">4 Milestones Created</h5>
                </div>
                <p className="text-green-700 text-sm mb-2">From location setup to online presence</p>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Clock className="w-3 h-3" />
                  <span>8-week optimized timeline</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-blue-900">12 Key Results Defined</h5>
                </div>
                <p className="text-blue-700 text-sm mb-2">Specific, measurable outcomes</p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>SMART goal framework</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-purple-900">Progress Tracking</h5>
                </div>
                <p className="text-purple-700 text-sm mb-2">Automated progress monitoring setup</p>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <Activity className="w-3 h-3" />
                  <span>Real-time analytics</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-orange-900">AI Optimization</h5>
                </div>
                <p className="text-orange-700 text-sm mb-2">Machine learning insights applied</p>
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <Brain className="w-3 h-3" />
                  <span>Success probability: 87%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-green-600" />
                <h5 className="font-semibold text-gray-900">AI Processing Summary</h5>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Data Points:</span>
                  <span className="ml-2 font-semibold text-green-600">{aiMetrics.dataPoints.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Processing Power:</span>
                  <span className="ml-2 font-semibold text-blue-600">{aiMetrics.processingPower}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Next Steps:</strong> Your roadmap is now live in Notion. Start with the first milestone and track progress weekly.
              </p>
            </div>
          </div>
        )

      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 p-6 rounded-xl border border-orange-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-900 text-lg">Weekly Tasks Generated</h4>
                  <p className="text-orange-700 text-sm">AI-Powered Task Optimization</p>
                </div>
              </div>
              <p className="text-orange-800 text-sm leading-relaxed">
                Your personalized task plan has been created with 5 prioritized tasks for this week, 
                optimized for maximum impact within your 15-hour time constraint.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-green-900">5 Tasks Prioritized</h5>
                </div>
                <p className="text-green-700 text-sm mb-2">Based on urgency and impact</p>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Target className="w-3 h-3" />
                  <span>Impact score: 9.2/10</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-blue-900">15 Hours Allocated</h5>
                </div>
                <p className="text-blue-700 text-sm mb-2">Perfect fit for your available time</p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Activity className="w-3 h-3" />
                  <span>Efficiency: 94%</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-purple-900">Execution Instructions</h5>
                </div>
                <p className="text-purple-700 text-sm mb-2">Step-by-step guidance for each task</p>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <UserCheck className="w-3 h-3" />
                  <span>Beginner-friendly</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <LightningIcon className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-indigo-900">Smart Automation</h5>
                </div>
                <p className="text-indigo-700 text-sm mb-2">AI-powered task scheduling</p>
                <div className="flex items-center gap-2 text-xs text-indigo-600">
                  <Cpu className="w-3 h-3" />
                  <span>Auto-optimized sequence</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-4 h-4 text-orange-600" />
                <h5 className="font-semibold text-gray-900">Task Analytics</h5>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Completion Rate:</span>
                  <span className="ml-2 font-semibold text-green-600">87%</span>
                </div>
                <div>
                  <span className="text-gray-600">Time Efficiency:</span>
                  <span className="ml-2 font-semibold text-blue-600">94%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Next Steps:</strong> Your tasks are ready in Notion. Start with the high-priority items and track completion daily.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Advanced AI Processing Engine</p>
          </div>
        </div>
        
        {!showResults ? (
          <>
            <div className="space-y-4 mb-6">
              {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm font-medium">{message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>✓ Processed</span>
                      <span>• {Math.floor(Math.random() * 200) + 100}ms</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {currentMessageIndex < messages.length && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="relative">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <div className="absolute inset-0 w-5 h-5 border-2 border-blue-200 rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium text-sm">AI is analyzing...</span>
                    <div className="flex items-center gap-2 mt-1 text-xs text-blue-600">
                      <Cpu className="w-3 h-3" />
                      <span>Processing Power: {aiMetrics.processingPower}%</span>
                      <span>•</span>
                      <Database className="w-3 h-3" />
                      <span>{aiMetrics.dataPoints.toLocaleString()} data points</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isComplete ? (
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-green-800 font-bold text-lg mb-2">AI Analysis Complete!</h4>
                <p className="text-green-700 text-sm mb-4">All processing stages finished successfully</p>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-green-600">Accuracy:</span>
                    <span className="ml-2 font-bold text-green-800">{aiMetrics.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-green-600">Confidence:</span>
                    <span className="ml-2 font-bold text-green-800">{aiMetrics.confidence}%</span>
                  </div>
                </div>
                <Button onClick={handleComplete} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Step {Math.min(currentMessageIndex + 1, messages.length)} of {messages.length}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentMessageIndex + 1) / messages.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Button variant="outline" onClick={onClose} size="sm" className="border-gray-300">
                  Cancel
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {renderResults()}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 border-gray-300">
                Close
              </Button>
              <Button onClick={handleClose} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold">
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function YCPrototype() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [weeklyTasks, setWeeklyTasks] = useState([
    { 
      id: 1, 
      text: "Research local bakery competition and pricing", 
      completed: false, 
      priority: "High", 
      duration: "4 hours",
      subtasks: [
        { text: "Visit 3-4 local bakeries to observe their operations", completed: false },
        { text: "Research pricing for similar products in the area", completed: false },
        { text: "Analyze customer traffic patterns and peak hours", completed: false },
        { text: "Document unique selling points and gaps in the market", completed: false }
      ]
    },
    { 
      id: 2, 
      text: "Create business plan draft with financial projections", 
      completed: false, 
      priority: "High", 
      duration: "6 hours",
      subtasks: [
        { text: "Outline business model and revenue streams", completed: false },
        { text: "Create 12-month financial projections", completed: false },
        { text: "Include market analysis and competitive positioning", completed: false },
        { text: "Define target customer segments and marketing strategy", completed: false }
      ]
    },
    { 
      id: 3, 
      text: "Set up business bank account and legal structure", 
      completed: false, 
      priority: "Medium", 
      duration: "3 hours",
      subtasks: [
        { text: "Choose and register business legal structure (LLC recommended)", completed: false },
        { text: "Apply for EIN and business bank account", completed: false },
        { text: "Set up basic accounting system and expense tracking", completed: false }
      ]
    },
    { 
      id: 4, 
      text: "Design logo and basic branding materials", 
      completed: false, 
      priority: "Medium", 
      duration: "2 hours",
      subtasks: [
        { text: "Create simple logo design concept", completed: false },
        { text: "Design business cards and basic marketing materials", completed: false },
        { text: "Establish brand colors and typography guidelines", completed: false }
      ]
    },
    { 
      id: 5, 
      text: "Monitor engagement and prepare for handling orders", 
      completed: false, 
      priority: "Medium", 
      duration: "3 hours",
      subtasks: [
        { text: "Set up order tracking system and customer database", completed: false },
        { text: "Create customer feedback collection process", completed: false },
        { text: "Prepare inventory management system and order forms", completed: false }
      ]
    }
  ])
  const [auditData, setAuditData] = useState({
    blockers: '',
    learnings: ''
  })
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean
    title: string
    messages: string[]
    type: 'strategic-plan' | 'roadmap' | 'tasks'
  }>({
    isOpen: false,
    title: '',
    messages: [],
    type: 'strategic-plan'
  })

  const businessData = {
    businessIdea: "I want to start a bakery specializing in fresh, locally sourced bread and pastries.",
    operatingLocation: "Providence, RI",
    vision: "To create a cozy neighborhood bakery that delivers affordable, fresh baked goods daily and becomes a staple in the Providence community.",
    currentStage: "All I have for now is an idea.",
    immediateGoal: "Launch and start selling within 2 months",
    endDate: "2025-09-13",
    executionApproach: "Pilot Program",
    reviewCadence: "Monthly",
    availableTime: "15 hours",
    relevantExperience: "Experienced baker, new to business operations",
    otherComments: "I want something small I can scale gradually. I'm considering starting by selling at farmers' markets or online."
  }

  const strategicHurdles = [
    {
      id: 1,
      description: "Need to decide whether to rent a commercial kitchen or bake from home.",
      deadline: "2025-07-21",
      priority: "High"
    },
    {
      id: 2,
      description: "Must register the business and secure local food permits.",
      deadline: "2025-07-27",
      priority: "High"
    },
    {
      id: 3,
      description: "No website or storefront - need a way to accept orders.",
      deadline: "2025-08-01",
      priority: "Medium"
    },
    {
      id: 4,
      description: "Limited startup budget",
      deadline: "2025-07-25",
      priority: "High"
    }
  ]

  const roadmapMilestones = [
    {
      milestone: "Secure Baking Location",
      objective: "Decide on and secure a commercial kitchen or home setup",
      deadline: "2025-07-21",
      keyResults: [
        "Research potential kitchen rentals",
        "Analyze legal aspects",
        "Secure the best location"
      ],
      status: "Planned",
      progress: 0
    },
    {
      milestone: "Develop Order/Sales Channels",
      objective: "Enable immediate sales using minimal viable channels",
      deadline: "2025-08-01",
      keyResults: [
        "Secure pop-up event participation",
        "Launch pre-order campaign",
        "Offer initial discounts"
      ],
      status: "Planned",
      progress: 0
    },
    {
      milestone: "Obtain Registrations/Permits",
      objective: "Complete business registrations and secure food permits",
      deadline: "2025-07-27",
      keyResults: [
        "Prepare documents",
        "Apply for required permits",
        "Monitor application status"
      ],
      status: "Planned",
      progress: 0
    },
    {
      milestone: "Develop Online Presence",
      objective: "Establish online footprint for orders and engagement",
      deadline: "2025-08-01",
      keyResults: [
        "Launch e-commerce website",
        "Activate social media profiles",
        "Collaborate with local influencers",
        "Implement feedback mechanisms"
      ],
      status: "Planned",
      progress: 0
    },
    {
      milestone: "Feedback & Monitoring",
      objective: "Adapt offerings based on customer feedback and market response",
      deadline: "2025-09-13",
      keyResults: [
        "Implement feedback mechanisms",
        "Track key performance metrics",
        "Adjust strategies based on insights"
      ],
      status: "Planned",
      progress: 0
    }
  ]



  const auditLogs = [
    {
      id: 1,
      date: "2025-07-15",
      whatBlocked: "Legal research took longer than expected due to complex zoning requirements.",
      whatLearned: "Need to start permit applications earlier and consider consulting with a business attorney.",
      tasksCompleted: 3,
      totalTasks: 5
    },
    {
      id: 2,
      date: "2025-07-08",
      whatBlocked: "Kitchen rental options were limited in the target area.",
      whatLearned: "Should expand search radius and consider shared kitchen spaces as alternatives.",
      tasksCompleted: 4,
      totalTasks: 6
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).map(file => file.name)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileName))
  }

  const toggleTask = (taskId: number) => {
    setWeeklyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const toggleSubtask = (taskId: number, subtaskIndex: number) => {
    setWeeklyTasks(prev => prev.map(task => 
      task.id === taskId ? {
        ...task,
        subtasks: task.subtasks.map((subtask, index) => 
          index === subtaskIndex ? { ...subtask, completed: !subtask.completed } : subtask
        )
      } : task
    ))
  }

  const handleAuditSubmit = () => {
    // Here you would typically save the audit data
    console.log('Audit submitted:', auditData)
    
    // Show success notification
    alert('✅ Weekly audit submitted successfully! Your progress has been recorded.')
    
    // Clear the form
    setAuditData({ blockers: '', learnings: '' })
  }

  const generateStrategicPlan = () => {
    setAiModal({
      isOpen: true,
      title: "AI Strategic Plan Generator",
      messages: [
        "Analyzing your business idea and market context...",
        "Researching Providence, RI bakery market conditions...",
        "Evaluating your experience level and available time...",
        "Identifying key success factors for bakery startups...",
        "Generating strategic priorities and execution approach...",
        "Creating comprehensive business strategy document...",
        "Connecting to Notion to save strategic plan..."
      ],
      type: 'strategic-plan'
    })
  }

  const generateRoadmap = () => {
    setAiModal({
      isOpen: true,
      title: "AI Roadmap Generator",
      messages: [
        "Processing your strategic plan and business goals...",
        "Analyzing timeline constraints and dependencies...",
        "Identifying critical milestones and key results...",
        "Calculating resource requirements and time estimates...",
        "Creating detailed execution timeline...",
        "Generating progress tracking framework...",
        "Saving roadmap to Notion workspace..."
      ],
      type: 'roadmap'
    })
  }

  const generateTasks = () => {
    setAiModal({
      isOpen: true,
      title: "AI Task Generator",
      messages: [
        "Analyzing current progress and strategic priorities...",
        "Evaluating available time (15 hours/week)...",
        "Identifying most impactful next actions...",
        "Prioritizing tasks based on urgency and importance...",
        "Creating detailed execution instructions...",
        "Estimating time requirements for each task...",
        "Generating personalized weekly task plan..."
      ],
      type: 'tasks'
    })
  }

  const handleAIComplete = () => {
    // Show success notification
    const messages = {
      'strategic-plan': 'Strategic plan generated and saved to Notion!',
      'roadmap': 'Roadmap created with detailed milestones!',
      'tasks': 'Weekly tasks generated and prioritized!'
    }
    
    // You could add a toast notification here
    console.log(messages[aiModal.type])
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Business Overview</h1>
        </div>
        <Button onClick={() => setIsDeployModalOpen(true)} className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Project
        </Button>
      </div>
      
      <p className="text-gray-600 text-lg">A snapshot of your business and all its key details.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900">Business Idea</h4>
              <p className="text-gray-600">{businessData.businessIdea}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Operating Location</h4>
              <p className="text-gray-600">{businessData.operatingLocation}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-900">Vision</h4>
              <p className="text-gray-600">{businessData.vision}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Current Stage</h4>
              <p className="text-gray-600">{businessData.currentStage}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Immediate Business Goal</h4>
              <p className="text-gray-600">{businessData.immediateGoal}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">End Date</h4>
              <p className="text-gray-600">{businessData.endDate}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Execution Approach</h4>
              <p className="text-gray-600">{businessData.executionApproach}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Review Cadence</h4>
              <p className="text-gray-600">{businessData.reviewCadence}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Available Time per Week</h4>
              <p className="text-gray-600">{businessData.availableTime}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Relevant Experience</h4>
              <p className="text-gray-600">{businessData.relevantExperience}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-900">Other Comments</h4>
              <p className="text-gray-600">{businessData.otherComments}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Hurdles Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Strategic Hurdles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicHurdles.map((hurdle) => (
              <div key={hurdle.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Hurdle {hurdle.id}: {hurdle.description}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Deadline: {hurdle.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ZapIcon className="w-4 h-4" />
                    <span>Priority: {hurdle.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No files uploaded</p>
              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </Button>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileName)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-more"
                />
                <label htmlFor="file-upload-more" className="cursor-pointer">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Add More Files
                  </Button>
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderRoadmap = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Business Roadmap</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={generateStrategicPlan}>
            <BarChart3 className="w-4 h-4" />
            Generate Strategic Plan
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={generateRoadmap}>
            <Map className="w-4 h-4" />
            Generate Roadmap
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsDeployModalOpen(true)}>
            <Rocket className="w-4 h-4" />
            Deploy
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600 text-lg">Your execution plan: see how each initiative and key result leads you forward.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Strategic Plan Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            This finalized strategic plan provides a robust approach to ensure the bakery efficiently launches and secures its first sales within the two-month goal. By quickly engaging with the market through pop-up events and social media strategies, alongside setting up efficient operations and a responsive feedback mechanism, the bakery is strategically positioned for growth and becoming a cherished fixture in the Providence neighborhood.
          </p>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Prioritization:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li><strong>Secure Baking Location:</strong> Foundational need for production.</li>
              <li><strong>Develop Interim Order and Sales Channels:</strong> Immediate sales generation to hit quick wins.</li>
              <li><strong>Obtain Registrations and Permits:</strong> Essential for legal compliance and full operation.</li>
              <li><strong>Online and Social Presence:</strong> Establish digital foothold for customer acquisition.</li>
              <li><strong>Feedback and Monitoring:</strong> Continuously adapt and improve the strategy based on customer insights.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Business Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Milestone</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Objective</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Deadline</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Key Results</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Progress</th>
                </tr>
              </thead>
              <tbody>
                {roadmapMilestones.map((milestone, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{milestone.milestone}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{milestone.objective}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{milestone.deadline}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
                        {milestone.keyResults.map((result, idx) => (
                          <li key={idx}>{result}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <Badge variant="secondary">{milestone.status}</Badge>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{milestone.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWeeklyTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Weekly Tasks</h1>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={generateTasks}>
          <Sparkles className="w-4 h-4" />
          Generate Tasks
        </Button>
      </div>
      
      <p className="text-gray-600 text-lg">Here's what you should prioritize this week to make tangible progress.</p>

      {/* Weekly Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Weekly Task Plan (15 hours available)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyTasks.map((task, index) => (
            <div key={task.id} className={`p-4 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {index + 1}. {task.text}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={task.priority === 'High' ? 'destructive' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {task.priority === 'High' ? '!! High' : 'Medium'}
                        {task.priority === 'High' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Subtasks */}
                  <div className="ml-7 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">How to Execute:</h4>
                    <ul className="space-y-2">
                      {task.subtasks.map((subtask, subtaskIndex) => (
                        <li key={subtaskIndex} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => toggleSubtask(task.id, subtaskIndex)}
                            className="mt-0.5 w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                          />
                          <span className={`text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                            {subtask.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Audit Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Weekly Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <X className="w-4 h-4 text-red-500" />
              What blocked your progress?
            </label>
            <textarea
              value={auditData.blockers}
              onChange={(e) => setAuditData(prev => ({ ...prev, blockers: e.target.value }))}
              placeholder="Describe any obstacles or challenges you faced this week..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              What did you learn this week?
            </label>
            <textarea
              value={auditData.learnings}
              onChange={(e) => setAuditData(prev => ({ ...prev, learnings: e.target.value }))}
              placeholder="Share key insights, lessons learned, or new knowledge gained..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleAuditSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Submit Audit
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderProgressAudit = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Progress Audit Logs</h1>
      </div>
      
      <p className="text-gray-600 text-lg">Review your progress and reflections to track momentum.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Total Audits: {auditLogs.length}</li>
              <li>• Average Tasks Completed: {Math.round(auditLogs.reduce((acc, log) => acc + log.tasksCompleted, 0) / auditLogs.length)}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Tasks Completed: {auditLogs.reduce((acc, log) => acc + log.tasksCompleted, 0)} of {auditLogs.reduce((acc, log) => acc + log.totalTasks, 0)}</li>
              <li>• Completion Rate: {Math.round((auditLogs.reduce((acc, log) => acc + log.tasksCompleted, 0) / auditLogs.reduce((acc, log) => acc + log.totalTasks, 0)) * 100)}%</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {auditLogs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Week of {log.date}</h4>
                    <Badge variant="outline">
                      {log.tasksCompleted}/{log.totalTasks} tasks
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <strong>What blocked progress:</strong> {log.whatBlocked}
                    </div>
                    <div>
                      <strong>What you learned:</strong> {log.whatLearned}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No audit records yet.</p>
              <p className="text-sm mt-1">Start tracking your progress to see insights here.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'roadmap':
        return renderRoadmap()
      case 'weekly-tasks':
        return renderWeeklyTasks()
      case 'progress-audit':
        return renderProgressAudit()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SE</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Summon Experts</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsDeployModalOpen(true)}>
            <Rocket className="w-4 h-4 mr-2" />
            Deploy
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex justify-center">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'roadmap', label: 'Roadmap', icon: Map },
              { id: 'weekly-tasks', label: 'Weekly Tasks', icon: Calendar },
              { id: 'progress-audit', label: 'Progress Audit', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.href = '/'}
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>

      {/* AI Modal */}
      <AIModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal({ isOpen: false, title: '', messages: [], type: 'strategic-plan' })}
        title={aiModal.title}
        messages={aiModal.messages}
        type={aiModal.type}
        onComplete={handleAIComplete}
      />

      {/* Deploy Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Deploy to Production</h3>
            <p className="text-gray-600 mb-6">
              This will deploy your Summon Experts platform to production. Are you sure you want to continue?
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setIsDeployModalOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => {
                setIsDeployModalOpen(false)
                alert('Deployment initiated! This is a demo - in production, this would deploy your app.')
              }}>
                Deploy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
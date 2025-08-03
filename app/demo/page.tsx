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
  Shield
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
  }, [isOpen, currentMessageIndex, messages.length])

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const handleClose = () => {
    setCurrentMessageIndex(0)
    setIsComplete(false)
    setShowResults(false)
    setAiMetrics({ accuracy: 0, confidence: 0, processingPower: 0, dataPoints: 0 })
    onClose()
  }

  const renderResults = () => {
    const results = {
      'strategic-plan': {
        title: 'Strategic Plan Generated',
        content: `**Bakery Business Strategic Plan**

**Executive Summary:**
Transform your bakery into a premium, tech-enabled destination with AI-driven operations and sustainable practices.

**Key Strategic Pillars:**

1. **Market Positioning**
   - Premium artisan bakery with tech integration
   - Focus on sustainability and local sourcing
   - Target: Urban professionals, food enthusiasts, health-conscious consumers

2. **Operational Excellence**
   - AI-powered inventory management
   - Automated production scheduling
   - Real-time quality monitoring systems

3. **Revenue Diversification**
   - Subscription boxes for corporate clients
   - Online ordering and delivery platform
   - Catering and event services
   - Baking classes and workshops

4. **Technology Integration**
   - Smart ovens with IoT connectivity
   - Customer loyalty app with personalized recommendations
   - Data analytics for demand forecasting

**Financial Projections:**
- Year 1: $500K revenue, 15% margin
- Year 3: $1.2M revenue, 25% margin
- Year 5: $2.5M revenue, 30% margin

**Implementation Timeline:**
- Phase 1 (Months 1-6): Core operations and branding
- Phase 2 (Months 7-12): Technology integration
- Phase 3 (Months 13-18): Market expansion
- Phase 4 (Months 19-24): Scaling and optimization`
      },
      'roadmap': {
        title: 'Business Roadmap Created',
        content: `**Bakery Business Roadmap**

**Q1 2024 - Foundation Phase**
- Secure funding and location
- Develop brand identity and marketing materials
- Set up legal structure and permits
- Hire core team (head baker, manager, 2 assistants)

**Q2 2024 - Launch Preparation**
- Complete facility build-out and equipment installation
- Develop initial menu and pricing strategy
- Launch social media presence and website
- Conduct soft opening and gather feedback

**Q3 2024 - Market Entry**
- Grand opening with marketing campaign
- Establish supplier relationships
- Launch loyalty program
- Begin catering services

**Q4 2024 - Growth Phase**
- Introduce online ordering system
- Expand menu based on customer feedback
- Launch corporate subscription program
- Optimize operations and reduce costs

**Q1 2025 - Technology Integration**
- Implement AI-powered inventory management
- Launch customer app with personalized recommendations
- Integrate smart oven technology
- Begin data collection and analysis

**Q2 2025 - Expansion**
- Open second location or food truck
- Launch baking classes and workshops
- Expand catering and event services
- Develop wholesale partnerships

**Q3-Q4 2025 - Scaling**
- Franchise opportunity evaluation
- Regional expansion planning
- Advanced technology implementation
- Strategic partnerships and acquisitions`
      },
      'tasks': {
        title: 'Weekly Tasks Generated',
        content: `**Weekly Task Plan for Bakery Launch**

**Week 1: Foundation**
- [ ] Finalize business plan and financial projections
- [ ] Secure business license and permits
- [ ] Research and select commercial kitchen location
- [ ] Create initial budget and funding strategy
- [ ] Set up business bank account and accounting system

**Week 2: Legal & Financial**
- [ ] Register business entity (LLC/Corporation)
- [ ] Apply for food service permits and health inspections
- [ ] Secure business insurance (general liability, property, workers comp)
- [ ] Open business credit card and line of credit
- [ ] Hire legal counsel for contracts and compliance

**Week 3: Location & Equipment**
- [ ] Sign commercial lease agreement
- [ ] Order commercial kitchen equipment
- [ ] Design kitchen layout and workflow
- [ ] Schedule equipment installation and testing
- [ ] Set up utilities and internet services

**Week 4: Branding & Marketing**
- [ ] Develop brand identity (logo, colors, messaging)
- [ ] Create website and social media accounts
- [ ] Design menu and pricing strategy
- [ ] Plan grand opening marketing campaign
- [ ] Order business cards and marketing materials

**Week 5: Team Building**
- [ ] Write job descriptions and post openings
- [ ] Interview and hire head baker
- [ ] Interview and hire assistant bakers
- [ ] Interview and hire front-of-house staff
- [ ] Create employee handbook and training materials

**Week 6: Operations Setup**
- [ ] Develop standard operating procedures
- [ ] Create inventory management system
- [ ] Set up point-of-sale system
- [ ] Establish supplier relationships
- [ ] Conduct staff training sessions

**Week 7: Menu Development**
- [ ] Test and finalize core menu items
- [ ] Develop seasonal specials and promotions
- [ ] Create recipe cards and production schedules
- [ ] Conduct taste testing with focus groups
- [ ] Finalize pricing strategy

**Week 8: Launch Preparation**
- [ ] Conduct soft opening for friends and family
- [ ] Gather feedback and make adjustments
- [ ] Finalize grand opening plans
- [ ] Complete all inspections and approvals
- [ ] Launch pre-opening marketing campaign`
      }
    }

    const result = results[type]

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold glass-text-white mb-4">{result.title}</h3>
          <p className="glass-text-teal text-lg">Your AI-generated content is ready!</p>
        </div>
        
        <div className="glass-panel p-6 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm glass-text-white font-medium leading-relaxed">
            {result.content}
          </pre>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button onClick={handleComplete} className="glass-button">
            Apply to Platform
          </Button>
          <Button variant="outline" onClick={handleClose} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            Close
          </Button>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold glass-text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!isComplete ? (
            <div className="space-y-6">
              {/* AI Processing Animation */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold glass-text-white mb-4">AI Processing...</h3>
                <p className="glass-text-teal mb-6">{messages[currentMessageIndex] || 'Analyzing your business requirements...'}</p>
              </div>

              {/* Progress Messages */}
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-center gap-2 text-sm ${
                    index <= currentMessageIndex ? 'glass-text-white' : 'glass-text-teal/50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      index <= currentMessageIndex ? 'bg-teal-500' : 'bg-white/20'
                    }`}></div>
                    {message}
                  </div>
                ))}
              </div>

              {/* AI Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium glass-text-teal">Accuracy</span>
                    <span className="text-sm font-bold glass-text-white">{aiMetrics.accuracy}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiMetrics.accuracy}%` }}
                    />
                  </div>
                </div>
                
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium glass-text-teal">Confidence</span>
                    <span className="text-sm font-bold glass-text-white">{aiMetrics.confidence}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiMetrics.confidence}%` }}
                    />
                  </div>
                </div>
                
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium glass-text-teal">Processing</span>
                    <span className="text-sm font-bold glass-text-white">{aiMetrics.processingPower}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiMetrics.processingPower}%` }}
                    />
                  </div>
                </div>
                
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium glass-text-teal">Data Points</span>
                    <span className="text-sm font-bold glass-text-white">{aiMetrics.dataPoints}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(aiMetrics.dataPoints / 2500) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      </div>
    </div>
  )
}

export default function YCPrototype() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiModalType, setAiModalType] = useState<'strategic-plan' | 'roadmap' | 'tasks'>('strategic-plan')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [loadingMessages] = useState([
    'Analyzing your business requirements...',
    'Processing market data and trends...',
    'Generating strategic recommendations...',
    'Creating detailed action plans...',
    'Finalizing your personalized roadmap...',
    'Preparing your results...'
  ])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [auditDisplayCount, setAuditDisplayCount] = useState(4)
  const [weeklyTasks, setWeeklyTasks] = useState([
    {
      id: 1,
      text: "Finalize business plan and financial projections",
      completed: false,
      priority: "High",
      duration: "2-3 hours",
      subtasks: [
        { id: 1, text: "Complete market analysis section", completed: false },
        { id: 2, text: "Create 3-year financial projections", completed: false },
        { id: 3, text: "Define pricing strategy", completed: false },
        { id: 4, text: "Review with business mentor", completed: false }
      ]
    },
    {
      id: 2,
      text: "Secure business license and permits",
      completed: false,
      priority: "High", 
      duration: "1-2 hours",
      subtasks: [
        { id: 1, text: "Apply for business license", completed: false },
        { id: 2, text: "Get food service permit", completed: false },
        { id: 3, text: "Apply for health department inspection", completed: false },
        { id: 4, text: "Register for sales tax", completed: false }
      ]
    },
    {
      id: 3,
      text: "Research and select commercial kitchen location",
      completed: false,
      priority: "Medium",
      duration: "3-4 hours",
      subtasks: [
        { id: 1, text: "Visit 3 potential locations", completed: false },
        { id: 2, text: "Compare rental costs and terms", completed: false },
        { id: 3, text: "Check zoning requirements", completed: false },
        { id: 4, text: "Negotiate lease terms", completed: false }
      ]
    },
    {
      id: 4,
      text: "Create initial budget and funding strategy",
      completed: false,
      priority: "High",
      duration: "2-3 hours",
      subtasks: [
        { id: 1, text: "List all startup costs", completed: false },
        { id: 2, text: "Research funding options", completed: false },
        { id: 3, text: "Create pitch deck", completed: false },
        { id: 4, text: "Schedule investor meetings", completed: false }
      ]
    },
    {
      id: 5,
      text: "Set up business bank account and accounting system",
      completed: false,
      priority: "Medium",
      duration: "1-2 hours",
      subtasks: [
        { id: 1, text: "Open business checking account", completed: false },
        { id: 2, text: "Set up QuickBooks or similar", completed: false },
        { id: 3, text: "Create expense tracking system", completed: false },
        { id: 4, text: "Set up payroll system", completed: false }
      ]
    }
  ])

  const strategicHurdles = [
    {
      id: 1,
      title: "Funding & Capital",
      description: "Securing initial investment and working capital for equipment, location, and operations",
      status: "In Progress",
      priority: "Critical"
    },
    {
      id: 2,
      title: "Location & Permits",
      description: "Finding suitable commercial kitchen space and obtaining all necessary permits and licenses",
      status: "Not Started",
      priority: "High"
    },
    {
      id: 3,
      title: "Team Building",
      description: "Hiring skilled bakers and staff who align with the brand vision and quality standards",
      status: "Planning",
      priority: "High"
    },
    {
      id: 4,
      title: "Market Competition",
      description: "Differentiating from established bakeries and building brand recognition in a competitive market",
      status: "Researching",
      priority: "Medium"
    },
    {
      id: 5,
      title: "Supply Chain",
      description: "Establishing reliable supplier relationships for quality ingredients and equipment",
      status: "Not Started",
      priority: "Medium"
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

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setWeeklyTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    ).map(task => {
      if (task.id === taskId) {
        // Check if all subtasks are completed
        const allSubtasksCompleted = task.subtasks.every(subtask => subtask.completed)
        return { ...task, completed: allSubtasksCompleted }
      }
      return task
    }))
  }

  const handleAuditSubmit = () => {
    // Simulate audit submission
    alert('Weekly audit submitted successfully!')
  }

  const generateStrategicPlan = () => {
    setAiModalType('strategic-plan')
    setIsLoading(true)
    setLoadingStep(0)
    
    // Simulate loading process
    const loadingInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1
        } else {
          clearInterval(loadingInterval)
          setIsLoading(false)
          setIsAIModalOpen(true)
          return 0
        }
      })
    }, 1500)
  }

  const generateRoadmap = () => {
    setAiModalType('roadmap')
    setIsLoading(true)
    setLoadingStep(0)
    
    // Simulate loading process
    const loadingInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1
        } else {
          clearInterval(loadingInterval)
          setIsLoading(false)
          setIsAIModalOpen(true)
          return 0
        }
      })
    }, 1500)
  }

  const generateTasks = () => {
    setAiModalType('tasks')
    setIsLoading(true)
    setLoadingStep(0)
    
    // Simulate loading process
    const loadingInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1
        } else {
          clearInterval(loadingInterval)
          setIsLoading(false)
          setIsAIModalOpen(true)
          return 0
        }
      })
    }, 1500)
  }

  const handleAIComplete = () => {
    // Handle AI completion - could update the UI or save results
    console.log('AI process completed')
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Business Overview</h1>
            <p className="text-teal-200 mt-1">A snapshot of your business and all its key details.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-teal-400 text-teal-200 hover:bg-teal-500/20 backdrop-blur-sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </div>



      {/* Business Highlights */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          Highlights
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Business Idea:</span>
            <span className="glass-text-white text-right max-w-md">I want to start a bakery specializing in fresh, locally sourced bread and pastries.</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Operating Location:</span>
            <span className="glass-text-white">Providence, RI</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Vision:</span>
            <span className="glass-text-white text-right max-w-md">To create a cozy neighborhood bakery that delivers affordable, fresh baked goods daily and becomes a staple in the Providence community.</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Current Stage:</span>
            <span className="glass-text-white">All I have for now is an idea.</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Immediate Business Goal:</span>
            <span className="glass-text-white">Launch and start selling within 2 months</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">End Date:</span>
            <span className="glass-text-white">2025-09-13</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Execution Approach:</span>
            <span className="glass-text-white">Pilot Program</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Review Cadence:</span>
            <span className="glass-text-white">Monthly</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Available Time per Week:</span>
            <span className="glass-text-white">15 hours</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Relevant Experience:</span>
            <span className="glass-text-white">Experienced baker, new to business operations</span>
          </div>
          <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
            <span className="font-semibold glass-text-teal">Other Comments:</span>
            <span className="glass-text-white text-right max-w-md">I want something small I can scale gradually. I'm considering starting by selling at farmers' markets or online.</span>
          </div>
        </div>
      </div>

      {/* Strategic Hurdles */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          Strategic Hurdles
        </h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-white/10 rounded-xl border border-white/10">
            <div className="flex-1">
              <h4 className="font-semibold glass-text-white">Need to decide whether to rent a commercial kitchen or bake from home.</h4>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm glass-text-teal">
                  <Calendar className="w-4 h-4" />
                  <span>2025-07-21</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-orange-400 font-medium">
                  <Zap className="w-4 h-4" />
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start justify-between p-4 bg-white/10 rounded-xl border border-white/10">
            <div className="flex-1">
              <h4 className="font-semibold glass-text-white">Must register the business and secure local food permits.</h4>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm glass-text-teal">
                  <Calendar className="w-4 h-4" />
                  <span>2025-07-27</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-orange-400 font-medium">
                  <Zap className="w-4 h-4" />
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start justify-between p-4 bg-white/10 rounded-xl border border-white/10">
            <div className="flex-1">
              <h4 className="font-semibold glass-text-white">No website or storefront - need a way to accept orders.</h4>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm glass-text-teal">
                  <Calendar className="w-4 h-4" />
                  <span>2025-08-01</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-blue-400 font-medium">
                  <Zap className="w-4 h-4" />
                  <span>Medium</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start justify-between p-4 bg-white/10 rounded-xl border border-white/10">
            <div className="flex-1">
              <h4 className="font-semibold glass-text-white">Limited startup budget</h4>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm glass-text-teal">
                  <Calendar className="w-4 h-4" />
                  <span>2025-07-25</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-orange-400 font-medium">
                  <Zap className="w-4 h-4" />
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
          Uploaded Files
        </h2>
        
        {/* File Upload Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium glass-text-teal mb-2">
            Upload Business Documents
          </label>
          <div className="border-2 border-dashed border-teal-400/30 rounded-xl p-6 text-center hover:border-teal-400/50 transition-colors cursor-pointer bg-white/5">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 glass-text-teal" />
              <p className="glass-text-white font-medium">Click to upload files</p>
              <p className="glass-text-teal-light text-sm mt-1">
                PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB each)
              </p>
            </label>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium glass-text-teal mb-3">Uploaded Files:</h3>
            {uploadedFiles.map((fileName, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 glass-text-teal" />
                  <span className="glass-text-white text-sm">{fileName}</span>
                </div>
                <button
                  onClick={() => removeFile(fileName)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-3 glass-text-teal/50" />
            <p className="glass-text-teal-light">No files uploaded yet</p>
            <p className="glass-text-teal/70 text-sm mt-1">
              Upload business plans, financial documents, or other relevant files
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderRoadmap = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Map className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold glass-text-white">Business Roadmap</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-button flex items-center gap-2" onClick={generateStrategicPlan}>
            <BarChart3 className="w-4 h-4" />
            Generate Strategic Plan
          </Button>
          <Button variant="outline" className="glass-button flex items-center gap-2" onClick={generateRoadmap}>
            <Map className="w-4 h-4" />
            Generate Roadmap
          </Button>
          <Button variant="outline" className="glass-button flex items-center gap-2" onClick={() => setIsAIModalOpen(true)}>
            <Rocket className="w-4 h-4" />
            Deploy
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <p className="glass-text-teal text-lg font-medium">Your execution plan: see how each initiative and key result leads you forward.</p>

      <div className="glass-panel p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold glass-text-white mb-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            Strategic Plan Highlights
          </h2>
        </div>
        <div>
          <p className="glass-text-white mb-6 font-medium">
            This finalized strategic plan provides a robust approach to ensure the bakery efficiently launches and secures its first sales within the two-month goal. By quickly engaging with the market through pop-up events and social media strategies, alongside setting up efficient operations and a responsive feedback mechanism, the bakery is strategically positioned for growth and becoming a cherished fixture in the Providence neighborhood.
          </p>
          
          <div>
            <h4 className="font-semibold glass-text-white mb-3">Prioritization:</h4>
            <ol className="list-decimal list-inside space-y-2 glass-text-white font-medium">
              <li><strong>Secure Baking Location:</strong> Foundational need for production.</li>
              <li><strong>Develop Interim Order and Sales Channels:</strong> Immediate sales generation to hit quick wins.</li>
              <li><strong>Obtain Registrations and Permits:</strong> Essential for legal compliance and full operation.</li>
              <li><strong>Online and Social Presence:</strong> Establish digital foothold for customer acquisition.</li>
              <li><strong>Feedback and Monitoring:</strong> Continuously adapt and improve the strategy based on customer insights.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold glass-text-white mb-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Map className="w-4 h-4 text-white" />
            </div>
            Business Roadmap
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="border border-white/20 px-4 py-3 text-left font-semibold glass-text-white">Milestone</th>
                <th className="border border-white/20 px-4 py-3 text-left font-semibold glass-text-white">Objective</th>
                <th className="border border-white/20 px-4 py-3 text-left font-semibold glass-text-white">Deadline</th>
                <th className="border border-white/20 px-4 py-3 text-left font-semibold glass-text-white">Key Results</th>
                <th className="border border-white/20 px-4 py-3 text-left font-semibold glass-text-white">Status</th>
                <th className="border border-white/20 px-4 py-3 text-left font-semibold glass-text-white">Progress</th>
              </tr>
            </thead>
            <tbody>
              {strategicHurdles.map((milestone, index) => (
                <tr key={index} className="hover:bg-white/10 transition-colors">
                  <td className="border border-white/20 px-4 py-3 font-bold glass-text-white">{milestone.title}</td>
                  <td className="border border-white/20 px-4 py-3 glass-text-white font-medium">{milestone.description}</td>
                  <td className="border border-white/20 px-4 py-3 glass-text-white font-medium">{milestone.status}</td>
                  <td className="border border-white/20 px-4 py-3 glass-text-white">
                    <ul className="list-disc list-inside space-y-1">
                      {/* No key results for hurdles, but could be added if needed */}
                    </ul>
                  </td>
                  <td className="border border-white/20 px-4 py-3">
                    <Badge variant="outline" className="bg-teal-500/30 text-teal-100 border-teal-400/50 font-semibold">{milestone.priority}</Badge>
                  </td>
                  <td className="border border-white/20 px-4 py-3 glass-text-white font-medium">{milestone.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderWeeklyTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold glass-text-white">Weekly Tasks</h1>
        </div>
        <Button variant="outline" className="glass-button flex items-center gap-2" onClick={generateTasks}>
          <Sparkles className="w-4 h-4" />
          Generate Tasks
        </Button>
      </div>
      
      <p className="glass-text-teal text-lg">Here's what you should prioritize this week to make tangible progress.</p>

      {/* Weekly Task List */}
      <div className="glass-panel p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold glass-text-white mb-2">Weekly Task Plan</h2>
          <p className="glass-text-teal">15 hours available this week</p>
        </div>
        <div className="space-y-4">
          {weeklyTasks.map((task, index) => (
            <div key={task.id} className={`p-6 rounded-xl border backdrop-blur-sm ${
              task.completed 
                ? 'bg-green-500/20 border-green-400/30' 
                : 'bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-6 h-6 mt-1">
                                      <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-teal-500 bg-white border-2 border-teal-400 rounded focus:ring-teal-400 focus:ring-2 checked:bg-teal-500 checked:border-teal-500"
                    />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-green-200' : 'glass-text-white'}`}>
                      {index + 1}. {task.text}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={task.priority === 'High' ? 'destructive' : 'outline'}
                        className={`flex items-center gap-1 font-semibold ${
                          task.priority === 'High' 
                            ? 'bg-red-500/30 text-red-100 border-red-400/50' 
                            : 'bg-teal-500/30 text-teal-100 border-teal-400/50'
                        }`}
                      >
                        {task.priority === 'High' ? '!! High' : 'Medium'}
                        {task.priority === 'High' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 font-semibold bg-white/20 text-teal-100 border-white/30">
                        <Clock className="w-3 h-3" />
                        {task.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Subtasks */}
                  <div className="ml-2 space-y-3">
                    <h4 className="text-sm font-medium glass-text-teal mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      How to Execute:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => toggleSubtask(task.id, subtask.id)}
                            className="w-4 h-4 text-teal-400 bg-white border-2 border-teal-400 rounded focus:ring-teal-400 focus:ring-1 checked:bg-teal-500 checked:border-teal-500"
                          />
                                              <span className={`text-sm font-medium ${subtask.completed ? 'line-through text-green-200' : 'glass-text-white'}`}>
                      {subtask.text}
                    </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Audit Section */}
      <div className="glass-panel p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold glass-text-white mb-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            Weekly Audit
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium glass-text-teal mb-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </div>
              What blocked your progress?
            </label>
            <textarea
              value={''} // No audit data state, so placeholder
              onChange={(e) => {}}
              placeholder="Describe any obstacles or challenges you faced this week..."
              className="glass-input w-full px-4 py-3 rounded-xl resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium glass-text-teal mb-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Lightbulb className="w-3 h-3 text-white" />
              </div>
              What did you learn this week?
            </label>
            <textarea
              value={''} // No audit data state, so placeholder
              onChange={(e) => {}}
              placeholder="Share key insights, lessons learned, or new knowledge gained..."
              className="glass-input w-full px-4 py-3 rounded-xl resize-none"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleAuditSubmit}
            className="glass-button w-full font-semibold py-4 rounded-xl"
          >
            Submit Audit
          </Button>
        </div>
      </div>
    </div>
  )

  const renderProgressAudit = () => {
    // Mock audit data with realistic dates from July 2025 and earlier
    const mockAudits = [
      {
        id: 1,
        date: '2025-07-28',
        title: 'Weekly Progress Review',
        tasksCompleted: 8,
        totalTasks: 12,
        completionRate: 67,
        notes: 'Made significant progress on business registration and kitchen setup. Need to focus on marketing strategy next week.',
        status: 'completed'
      },
      {
        id: 2,
        date: '2025-07-21',
        title: 'Mid-Month Assessment',
        tasksCompleted: 5,
        totalTasks: 10,
        completionRate: 50,
        notes: 'Completed market research and finalized business plan. Behind schedule on supplier contacts.',
        status: 'completed'
      },
      {
        id: 3,
        date: '2025-07-14',
        title: 'Week 2 Progress Check',
        tasksCompleted: 6,
        totalTasks: 8,
        completionRate: 75,
        notes: 'Excellent progress on recipe development and cost analysis. Ready to start vendor outreach.',
        status: 'completed'
      },
      {
        id: 4,
        date: '2025-07-07',
        title: 'Launch Week Review',
        tasksCompleted: 3,
        totalTasks: 6,
        completionRate: 50,
        notes: 'Started strong with business idea validation. Need to accelerate planning phase.',
        status: 'completed'
      },
      {
        id: 5,
        date: '2025-06-30',
        title: 'Month-End Review',
        tasksCompleted: 7,
        totalTasks: 9,
        completionRate: 78,
        notes: 'Strong month with excellent progress on financial planning and supplier negotiations. Ready for next phase.',
        status: 'completed'
      },
      {
        id: 6,
        date: '2025-06-23',
        title: 'Strategic Planning Session',
        tasksCompleted: 4,
        totalTasks: 7,
        completionRate: 57,
        notes: 'Completed strategic framework and identified key growth opportunities. Need to finalize implementation timeline.',
        status: 'completed'
      },
      {
        id: 7,
        date: '2025-06-16',
        title: 'Market Research Completion',
        tasksCompleted: 9,
        totalTasks: 11,
        completionRate: 82,
        notes: 'Extensive market research completed. Identified target demographics and competitive advantages. Ready for business plan development.',
        status: 'completed'
      },
      {
        id: 8,
        date: '2025-06-09',
        title: 'Initial Setup Phase',
        tasksCompleted: 2,
        totalTasks: 5,
        completionRate: 40,
        notes: 'Basic setup completed. Need to accelerate on core business planning and financial projections.',
        status: 'completed'
      }
    ]

    const totalAudits = mockAudits.length
    const averageCompletion = Math.round(mockAudits.reduce((sum, audit) => sum + audit.completionRate, 0) / totalAudits)
    const totalTasksCompleted = mockAudits.reduce((sum, audit) => sum + audit.tasksCompleted, 0)
    const totalTasks = mockAudits.reduce((sum, audit) => sum + audit.totalTasks, 0)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold glass-text-white">Progress Audit Logs</h1>
        </div>
        
        <p className="glass-text-teal text-lg font-medium">Review your progress and reflections to track momentum.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold glass-text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Audit Summary
              </h2>
            </div>
            <ul className="space-y-2 glass-text-white font-medium">
              <li>• Total Audits: {totalAudits}</li>
              <li>• Average Completion Rate: {averageCompletion}%</li>
            </ul>
          </div>

          <div className="glass-panel p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold glass-text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                Task Completion
              </h2>
            </div>
            <ul className="space-y-2 glass-text-white font-medium">
              <li>• Tasks Completed: {totalTasksCompleted} of {totalTasks}</li>
              <li>• Overall Completion Rate: {Math.round((totalTasksCompleted / totalTasks) * 100)}%</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold glass-text-white">Recent Audit Records</h2>
          {mockAudits.slice(0, auditDisplayCount).map((audit) => (
            <div key={audit.id} className="glass-panel p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold glass-text-white">{audit.title}</h3>
                    <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'} className="bg-teal-500/30 text-teal-100 border-teal-400/50 font-semibold">
                      {audit.status}
                    </Badge>
                  </div>
                  <p className="text-sm glass-text-teal mb-3 font-medium">{new Date(audit.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm glass-text-teal font-medium">
                      Tasks: {audit.tasksCompleted}/{audit.totalTasks}
                    </span>
                    <span className="text-sm glass-text-teal font-medium">
                      Completion: {audit.completionRate}%
                    </span>
                  </div>
                  <p className="glass-text-white font-medium">{audit.notes}</p>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{audit.completionRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Load More Button */}
          {auditDisplayCount < mockAudits.length && (
            <div className="text-center pt-4">
              <Button 
                onClick={() => setAuditDisplayCount(prev => Math.min(prev + 2, mockAudits.length))}
                className="glass-button"
              >
                Load More Records
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

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
    <div className="demo-page min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="glassmorphism-bg"></div>
      
      {/* Main content with backdrop blur */}
      <div className="relative z-10">
        {/* Top Header - Glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SE</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Summon Experts</h1>
                <p className="text-teal-200 text-sm">AI-Powered Business Planning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAIModalOpen(true)} 
                className="border-teal-400 text-teal-200 hover:bg-teal-500/20 backdrop-blur-sm"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-3">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-teal-500/80 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-teal-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.href = '/'}
              className="text-teal-200 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Main Content - Glassmorphism */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {renderContent()}
          </div>
        </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold glass-text-white mb-4">AI Processing...</h3>
              <p className="glass-text-teal mb-6">{loadingMessages[loadingStep]}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Loading Steps */}
              <div className="space-y-2">
                {loadingMessages.map((message, index) => (
                  <div key={index} className={`flex items-center gap-2 text-sm ${
                    index <= loadingStep ? 'glass-text-white' : 'glass-text-teal/50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      index <= loadingStep ? 'bg-teal-500' : 'bg-white/20'
                    }`}></div>
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title={`AI ${aiModalType} Generator`}
        messages={[]} // Messages will be generated by the AI
        type={aiModalType}
        onComplete={handleAIComplete}
      />

      {/* Deploy Modal */}
      {/* This modal is no longer needed as the AI modal handles deployment */}
      {/* {isDeployModalOpen && (
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
      )} */}
      </div>
    </div>
  )
} 
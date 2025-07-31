'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
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
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
          <p className="text-gray-600">Your AI-generated content is ready!</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
            {result.content}
          </pre>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
            Apply to Platform
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!isComplete ? (
            <div className="space-y-6">
              {/* AI Processing Animation */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Processing...</h3>
                <p className="text-gray-600">Analyzing your business requirements</p>
              </div>

              {/* Progress Messages */}
              <div className="space-y-3">
                {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      index === currentMessageIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        index === currentMessageIndex ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                      }`} />
                      <p className="text-sm text-gray-700">{message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Accuracy</span>
                    <span className="text-sm font-bold text-gray-900">{aiMetrics.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiMetrics.accuracy}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Confidence</span>
                    <span className="text-sm font-bold text-gray-900">{aiMetrics.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiMetrics.confidence}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Processing</span>
                    <span className="text-sm font-bold text-gray-900">{aiMetrics.processingPower}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${aiMetrics.processingPower}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Data Points</span>
                    <span className="text-sm font-bold text-gray-900">{aiMetrics.dataPoints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [weeklyTasks, setWeeklyTasks] = useState([
    {
      id: 1,
      text: "Finalize business plan and financial projections",
      completed: false,
      priority: "High",
      duration: "2-3 hours"
    },
    {
      id: 2,
      text: "Secure business license and permits",
      completed: false,
      priority: "High", 
      duration: "1-2 hours"
    },
    {
      id: 3,
      text: "Research and select commercial kitchen location",
      completed: false,
      priority: "Medium",
      duration: "3-4 hours"
    },
    {
      id: 4,
      text: "Create initial budget and funding strategy",
      completed: false,
      priority: "High",
      duration: "2-3 hours"
    },
    {
      id: 5,
      text: "Set up business bank account and accounting system",
      completed: false,
      priority: "Medium",
      duration: "1-2 hours"
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

  const toggleSubtask = (taskId: number, subtaskIndex: number) => {
    // This would be implemented if we had subtasks
    console.log(`Toggling subtask ${subtaskIndex} for task ${taskId}`)
  }

  const handleAuditSubmit = () => {
    // Simulate audit submission
    alert('Weekly audit submitted successfully!')
  }

  const generateStrategicPlan = () => {
    setAiModalType('strategic-plan')
    setIsAIModalOpen(true)
  }

  const generateRoadmap = () => {
    setAiModalType('roadmap')
    setIsAIModalOpen(true)
  }

  const generateTasks = () => {
    setAiModalType('tasks')
    setIsAIModalOpen(true)
  }

  const handleAIComplete = () => {
    // Handle AI completion - could update the UI or save results
    console.log('AI process completed')
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bakery Business Plan</h1>
          <p className="text-gray-600 mt-2">AI-Powered Strategic Planning & Execution</p>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={generateStrategicPlan}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Strategic Plan</h3>
                <p className="text-sm text-gray-600">AI-powered business strategy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={generateRoadmap}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Roadmap</h3>
                <p className="text-sm text-gray-600">Timeline and milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={generateTasks}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Tasks</h3>
                <p className="text-sm text-gray-600">Weekly action items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Hurdles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Strategic Hurdles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicHurdles.map((hurdle) => (
              <div key={hurdle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{hurdle.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{hurdle.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={hurdle.priority === 'Critical' ? 'destructive' : 'secondary'}>
                      {hurdle.priority}
                    </Badge>
                    <Badge variant="outline">{hurdle.status}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-500" />
            <span>Uploaded Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Upload business documents, plans, or research</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsAIModalOpen(true)}>
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
                {strategicHurdles.map((milestone, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{milestone.title}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{milestone.description}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{milestone.status}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      <ul className="list-disc list-inside space-y-1">
                        {/* No key results for hurdles, but could be added if needed */}
                      </ul>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <Badge variant="secondary">{milestone.priority}</Badge>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{milestone.status}</td>
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
                      {/* No subtasks for tasks, but could be added if needed */}
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
              value={''} // No audit data state, so placeholder
              onChange={(e) => {}}
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
              value={''} // No audit data state, so placeholder
              onChange={(e) => {}}
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
              <li>• Total Audits: 0</li>
              <li>• Average Tasks Completed: 0</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Tasks Completed: 0 of 0</li>
              <li>• Completion Rate: 0%</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No audit records yet.</p>
            <p className="text-sm mt-1">Start tracking your progress to see insights here.</p>
          </div>
        </CardContent>
      </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden platform-theme">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Main content with backdrop blur */}
      <div className="relative z-10">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SE</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Summon Experts</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAIModalOpen(true)}>
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
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

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
  Sun,
  Moon,
  Building
} from 'lucide-react'

type TabType = 'overview' | 'roadmap' | 'weekly-tasks'

export default function MainPlatform() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const router = useRouter()

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    // Toggle body class for global theme
    if (isDarkTheme) {
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
      document.body.classList.add('dark')
    }
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
            <h1 className="text-3xl font-bold glass-text-white">Business Highlights</h1>
            <p className="glass-text-teal mt-1">Complete business profile and strategic foundation</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-button"
            onClick={() => window.location.href = '/platform/growth-plan'}
          >
            <Target className="w-4 h-4 mr-2" />
            New Growth Plan
          </Button>
          <Button variant="outline" size="sm" className="glass-button">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </div>

      {/* Main Layout - Three Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* About Founder Section */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              About Founder
            </h2>
            <p className="glass-text-teal text-sm mb-4 underline">User profile</p>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Full Name:</span>
                <span className="glass-text-white">John Baker</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Email Address:</span>
                <span className="glass-text-white">john@bakery.com</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Phone:</span>
                <span className="glass-text-white">(401) 555-0123</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Industry Experience:</span>
                <span className="glass-text-white text-right max-w-md">Professional history</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Expertise:</span>
                <span className="glass-text-white text-right max-w-md">Skills, Certification & Knowledge</span>
              </div>
            </div>
          </div>

          {/* Strategic Goals Section */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              Strategic Goals
            </h2>
            <p className="glass-text-teal text-sm mb-4 underline">Vision, Mission, and Performance Targets</p>
            
            {/* Vision & Mission */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Vision Statement:</span>
                <span className="glass-text-white text-right max-w-md">To become the leading artisan bakery in Providence, serving 1000+ customers monthly with fresh, locally-sourced bread and pastries</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Mission Statement:</span>
                <span className="glass-text-white text-right max-w-md">Delivering affordable, fresh baked goods daily while building a staple presence in the Providence community</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Vision:</span>
                <span className="glass-text-white text-right max-w-md">Where should you be in 5 years</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Current Stage:</span>
                <span className="glass-text-white text-right max-w-md">At start</span>
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                  <span className="font-medium glass-text-teal">Customers per month:</span>
                  <span className="glass-text-white">0</span>
                </div>
                <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                  <span className="font-medium glass-text-teal">Revenue per month:</span>
                  <span className="glass-text-white">$0</span>
                </div>
                <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                  <span className="font-medium glass-text-teal">Employees/team size:</span>
                  <span className="glass-text-white">1</span>
                </div>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Aspirational Goals:</span>
                <span className="glass-text-white text-right max-w-md">Where should current goals be in 12 months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* About Business Section */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              About Business
            </h2>
            <p className="glass-text-teal text-sm mb-4 underline">Business basics</p>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Business Name:</span>
                <span className="glass-text-white">Providence Artisan Bakery</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Start Month/Year:</span>
                <span className="glass-text-white">September 2025</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Location:</span>
                <span className="glass-text-white">Providence, RI, USA</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Business Description:</span>
                <span className="glass-text-white text-right max-w-md">What do you do?</span>
              </div>
              <div className="flex justify-between items-start p-3 bg-white/5 rounded-xl">
                <span className="font-semibold glass-text-teal">Service Offerings:</span>
                <span className="glass-text-white text-right max-w-md">What are you offering customers now?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Growth Plan Section */}
      <div className="mt-8">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-teal-400" />
              Current Growth Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">No Active Growth Plan</h3>
              <p className="text-gray-400 mb-4">You haven't created a growth plan yet. Start building your 90-day strategy!</p>
              <Button
                onClick={() => window.location.href = '/platform/growth-plan'}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Create Your First Growth Plan
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <h1 className="text-3xl font-bold glass-text-white">Strategic Plan</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-button flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Generate Strategic Plan
          </Button>
          <Button variant="outline" className="glass-button flex items-center gap-2">
            <Map className="w-4 h-4" />
            Generate Roadmap
          </Button>
          <Button variant="outline" className="glass-button flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Deploy
          </Button>
        </div>
      </div>
      
      <p className="glass-text-teal text-lg font-medium">This will have a duration of 3 months for every user.</p>

      {/* 5-Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Growth Plan Form (Top-Left) */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              Growth Plan (Form)
            </h2>
            <p className="glass-text-teal text-sm mb-4">Summary (last growth plan + audit log)</p>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium glass-text-teal">User Input:</label>
                <div className="space-y-2">
                  <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                    <span className="font-medium glass-text-teal">Current stage (last qtr. no.):</span>
                    <input type="text" className="glass-input px-2 py-1 text-sm w-20" placeholder="0" />
                  </div>
                  <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                    <span className="font-medium glass-text-teal">Aspirational goals (next qtr. no):</span>
                    <input type="text" className="glass-input px-2 py-1 text-sm w-20" placeholder="100" />
                  </div>
                  <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                    <span className="font-medium glass-text-teal">Any other Business Priorities:</span>
                    <input type="text" className="glass-input px-2 py-1 text-sm w-32" placeholder="..." />
                  </div>
                  <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                    <span className="font-medium glass-text-teal">Ongoing challenges (if any):</span>
                    <input type="text" className="glass-input px-2 py-1 text-sm w-32" placeholder="..." />
                  </div>
                  <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                    <span className="font-medium glass-text-teal">Availability (hours per week):</span>
                    <input type="text" className="glass-input px-2 py-1 text-sm w-20" placeholder="15" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Plan Read-only (Bottom-Left) */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              Growth Plan (Read-only)
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Priorities + goals + challenges:</span>
                <span className="glass-text-white text-right max-w-md">Objectives & Key Results (OKRs)</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Availability (hours per week):</span>
                <span className="glass-text-white">15</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Start date:</span>
                <span className="glass-text-white">Now</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">End date:</span>
                <span className="glass-text-white">90 days from now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Project Roadmap (Top-Right) */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <Map className="w-4 h-4 text-white" />
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <Map className="w-4 h-4 text-white" />
              </div>
              Project Roadmap (Read-only)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-white/20">
                    <th className="border border-white/20 px-3 py-2 text-left font-semibold glass-text-white text-sm">Initiatives</th>
                    <th className="border border-white/20 px-3 py-2 text-left font-semibold glass-text-white text-sm">Completion (%)</th>
                    <th className="border border-white/20 px-3 py-2 text-left font-semibold glass-text-white text-sm">Timeline</th>
                    <th className="border border-white/20 px-3 py-2 text-left font-semibold glass-text-white text-sm">Dependencies</th>
                    <th className="border border-white/20 px-3 py-2 text-left font-semibold glass-text-white text-sm">Metrics (from KR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-white/10 transition-colors">
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Secure Location</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">25%</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Week 1-2</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">None</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Location secured</td>
                  </tr>
                  <tr className="hover:bg-white/10 transition-colors">
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Get Permits</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">0%</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Week 2-3</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Location</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Permits obtained</td>
                  </tr>
                  <tr className="hover:bg-white/10 transition-colors">
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Launch Marketing</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">0%</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Week 3-4</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Permits</td>
                    <td className="border border-white/20 px-3 py-2 glass-text-white text-sm">Social presence</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Plan of Action (Middle-Right) */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              Plan of Action (Read-only)
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Action plan:</span>
                <span className="glass-text-white text-right max-w-md">List of initiatives/activities</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Line of action:</span>
                <span className="glass-text-white text-right max-w-md">Prioritization path/sequence</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Dependencies/Risk areas:</span>
                <span className="glass-text-white text-right max-w-md">Mitigation strategies</span>
              </div>
            </div>
          </div>

          {/* Market Insight (Bottom-Right) */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Market Insight
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Industry & Market data:</span>
                <span className="glass-text-white text-right max-w-md">Specific to State</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Market Trends:</span>
                <span className="glass-text-white text-right max-w-md">Specific to country</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Growth Opportunities:</span>
                <span className="glass-text-white text-right max-w-md">Specific to county & State</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">Competitor action:</span>
                <span className="glass-text-white text-right max-w-md">Specific to county & state</span>
              </div>
              <div className="flex justify-between items-start p-2 bg-white/5 rounded-lg">
                <span className="font-medium glass-text-teal">User Involvement:</span>
                <span className="glass-text-white text-right max-w-md">Market Segmentation (identify 1 preferred customer group)</span>
              </div>
            </div>
          </div>
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
          <h1 className="text-3xl font-bold glass-text-white">Weekly Priorities</h1>
        </div>
        <Button variant="outline" className="glass-button flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generate Tasks
        </Button>
      </div>
      
      <p className="glass-text-teal text-lg">This is done every week (or 7 days)</p>

      {/* Two-Column Layout: MITs and Progress Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - MITs */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              MITs - Most Important Tasks
            </h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold glass-text-white">List of Tasks:</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm glass-text-teal">• How to execute (guidelines/recommendations)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm glass-text-teal">• Status marker: done?</span>
                  </div>
                </div>
              </div>
              
              {/* Sample Task */}
              <div className="p-4 rounded-xl border backdrop-blur-sm bg-white/10 border-white/20">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500 bg-white border-2 border-teal-400 rounded focus:ring-teal-400 focus:ring-2 mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold glass-text-white">1. Finalize business plan</h4>
                    
                    {/* How to Execute */}
                    <div className="mt-3">
                      <h5 className="text-sm font-medium glass-text-teal mb-2">How to execute:</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-4">
                          <input type="checkbox" className="w-3 h-3 text-teal-400 bg-white border border-teal-400 rounded" />
                          <span className="text-sm glass-text-white">Complete market analysis section</span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <input type="checkbox" className="w-3 h-3 text-teal-400 bg-white border border-teal-400 rounded" />
                          <span className="text-sm glass-text-white">Create 3-year financial projections</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Progress Audit */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold glass-text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              Progress Audit
            </h2>
            <div className="space-y-4">
              {/* All Tasks Status */}
              <div className="space-y-3">
                <h3 className="font-semibold glass-text-white">All tasks:</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm glass-text-teal">• Status Markers: completed/uncompleted</span>
                  </div>
                </div>
                
                {/* Task Completion Summary */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm glass-text-teal">Overall Progress:</span>
                    <span className="text-sm glass-text-white font-medium">0 of 1 completed</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
              
              {/* Blockers/Challenges */}
              <div className="space-y-3">
                <h3 className="font-semibold glass-text-white">Blockers/challenges (if any):</h3>
                <textarea
                  placeholder="Describe any obstacles or challenges you faced this week..."
                  className="glass-input w-full px-3 py-2 rounded-lg resize-none text-sm"
                  rows={3}
                />
              </div>
              
              {/* Lessons Learned */}
              <div className="space-y-3">
                <h3 className="font-semibold glass-text-white">Lesson learned (if any):</h3>
                <textarea
                  placeholder="Share key insights, lessons learned, or new knowledge gained..."
                  className="glass-input w-full px-3 py-2 rounded-lg resize-none text-sm"
                  rows={3}
                />
              </div>
              
              {/* Submit Button */}
              <Button className="glass-button w-full font-semibold py-3 rounded-lg">
                Submit Audit
              </Button>
            </div>
          </div>
        </div>
      </div>
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
      default:
        return renderOverview()
    }
  }

  return (
    <div className={`demo-page ${isDarkTheme ? 'dark' : 'light'} min-h-screen relative overflow-hidden`}>
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
                <h1 className="text-xl font-bold glass-text-white">Summon Experts</h1>
                <p className="glass-text-teal text-sm">AI-Powered Business Planning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-button"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="glass-button"
              >
                {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/platform')}
                className="glass-button"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/platform/settings')}
                className="glass-button"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/')}
                className="glass-button text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-3">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              {[
                { id: 'overview', label: 'Business Highlights', icon: BookOpen },
                { id: 'roadmap', label: 'Strategic Plan', icon: Map },
                { id: 'weekly-tasks', label: 'Weekly Priorities', icon: Calendar }
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
                        : 'glass-text-teal hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="flex justify-center mt-3">
            {/* Forms Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm glass-text-teal font-medium">Forms:</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-button text-xs px-3 py-1"
                onClick={() => router.push('/platform/account')}
              >
                Create Account
              </Button>
              <span className="text-white/40">|</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-button text-xs px-3 py-1"
                onClick={() => router.push('/platform/login')}
              >
                Log-in
              </Button>
              <span className="text-white/40">|</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-button text-xs px-3 py-1"
                onClick={() => router.push('/platform/business-setup')}
              >
                Business Setup
              </Button>
              <span className="text-white/40">|</span>
                            <Button 
                variant="outline" 
                size="sm" 
                className="glass-button text-xs px-3 py-1"
                onClick={() => router.push('/platform/growth-plan')}
              >
                Growth Plan
              </Button>
              <span className="text-white/40">|</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-button text-xs px-3 py-1"
                onClick={() => router.push('/platform/growth-lever')}
              >
                Growth Lever
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Glassmorphism */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

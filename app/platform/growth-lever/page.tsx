'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'

interface WeeklyData {
  week: string
  newCustomers: number
  repeatCustomers: number
  revenue: number
}

interface StrategicGoals {
  quarterlyCustomers: number
  quarterlyRevenue: number
  yearlyCustomers: number
  yearlyRevenue: number
}

export default function GrowthLeverDashboard() {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'quarterly'>('weekly')
  const [isAddingData, setIsAddingData] = useState(false)
  const [missingWeek, setMissingWeek] = useState<string | null>(null)
  
  // Strategic Goals (from Strategic Goals section)
  const [strategicGoals] = useState<StrategicGoals>({
    quarterlyCustomers: 100,
    quarterlyRevenue: 15000,
    yearlyCustomers: 400,
    yearlyRevenue: 60000
  })

  // Sample weekly data (in real app, this would come from Audit Log)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([
    { week: 'Week 1', newCustomers: 5, repeatCustomers: 0, revenue: 250 },
    { week: 'Week 2', newCustomers: 8, repeatCustomers: 3, revenue: 450 },
    { week: 'Week 3', newCustomers: 12, repeatCustomers: 5, revenue: 680 },
    { week: 'Week 4', newCustomers: 15, repeatCustomers: 8, revenue: 920 },
    { week: 'Week 5', newCustomers: 18, repeatCustomers: 12, revenue: 1150 },
    { week: 'Week 6', newCustomers: 22, repeatCustomers: 15, revenue: 1380 },
    { week: 'Week 7', newCustomers: 25, repeatCustomers: 18, revenue: 1620 },
    { week: 'Week 8', newCustomers: 28, repeatCustomers: 22, revenue: 1850 },
    { week: 'Week 9', newCustomers: 0, repeatCustomers: 0, revenue: 0 }, // Missing data
    { week: 'Week 10', newCustomers: 32, repeatCustomers: 25, revenue: 2100 },
    { week: 'Week 11', newCustomers: 35, repeatCustomers: 28, revenue: 2350 },
    { week: 'Week 12', newCustomers: 38, repeatCustomers: 32, revenue: 2600 }
  ])

  // Calculate current quarter progress
  const currentQuarter = Math.ceil(new Date().getMonth() / 3)
  const quarterStartWeek = (currentQuarter - 1) * 13 + 1
  const quarterEndWeek = currentQuarter * 13
  
  const quarterData = weeklyData.filter((_, index) => 
    index + 1 >= quarterStartWeek && index + 1 <= quarterEndWeek
  )

  const totalCustomers = weeklyData.reduce((sum, week) => sum + week.newCustomers + week.repeatCustomers, 0)
  const totalRevenue = weeklyData.reduce((sum, week) => sum + week.revenue, 0)
  
  const quarterCustomers = quarterData.reduce((sum, week) => sum + week.newCustomers + week.repeatCustomers, 0)
  const quarterRevenue = quarterData.reduce((sum, week) => sum + week.revenue, 0)

  // Calculate progress percentages
  const customerProgress = (quarterCustomers / strategicGoals.quarterlyCustomers) * 100
  const revenueProgress = (quarterRevenue / strategicGoals.quarterlyRevenue) * 100

  // Determine status
  const getStatus = (actual: number, expected: number, elapsed: number) => {
    const expectedAtThisPoint = (expected / 13) * elapsed
    return actual >= expectedAtThisPoint ? 'on-track' : 'off-track'
  }

  const customerStatus = getStatus(quarterCustomers, strategicGoals.quarterlyCustomers, quarterData.length)
  const revenueStatus = getStatus(quarterRevenue, strategicGoals.quarterlyRevenue, quarterData.length)

  // Check for missing data
  useEffect(() => {
    const missingWeekData = weeklyData.find(week => week.newCustomers === 0 && week.repeatCustomers === 0 && week.revenue === 0)
    if (missingWeekData) {
      setMissingWeek(missingWeekData.week)
    }
  }, [weeklyData])

  // Quick data input form
  const [quickInput, setQuickInput] = useState({
    newCustomers: '',
    repeatCustomers: '',
    revenue: ''
  })

  const handleQuickInput = () => {
    if (missingWeek && quickInput.newCustomers && quickInput.repeatCustomers && quickInput.revenue) {
      setWeeklyData(prev => prev.map(week => 
        week.week === missingWeek 
          ? {
              ...week,
              newCustomers: parseInt(quickInput.newCustomers),
              repeatCustomers: parseInt(quickInput.repeatCustomers),
              revenue: parseInt(quickInput.revenue)
            }
          : week
      ))
      setMissingWeek(null)
      setQuickInput({ newCustomers: '', repeatCustomers: '', revenue: '' })
      setIsAddingData(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Growth Levers Dashboard</h1>
        <p className="text-gray-400">Tracking Customers & Revenue vs Your Strategic Goals</p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
          {[
            { id: 'weekly', label: 'Weekly', icon: Calendar },
            { id: 'monthly', label: 'Monthly', icon: BarChart3 },
            { id: 'quarterly', label: 'Quarterly', icon: TrendingUp }
          ].map((mode) => {
            const Icon = mode.icon
            return (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? 'default' : 'ghost'}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === mode.id 
                    ? 'bg-teal-500/80 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-teal-400" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">{totalCustomers}</div>
            <div className="text-sm text-gray-400">All time</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              New Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">{quarterCustomers}</div>
            <div className="text-sm text-gray-400">
              {customerProgress.toFixed(1)}% to Q{currentQuarter} goal
            </div>
            <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs ${
              customerStatus === 'on-track' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {customerStatus === 'on-track' ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              {customerStatus === 'on-track' ? 'On Track' : 'Off Track'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Repeat Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {weeklyData.reduce((sum, week) => sum + week.repeatCustomers, 0)}
            </div>
            <div className="text-sm text-gray-400">No goal - just tracking</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">${quarterRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">
              {revenueProgress.toFixed(1)}% to Q{currentQuarter} goal
            </div>
            <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs ${
              revenueStatus === 'on-track' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {revenueStatus === 'on-track' ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              {revenueStatus === 'on-track' ? 'On Track' : 'Off Track'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missing Data Alert */}
      {missingWeek && (
        <Card className="glass-panel border-yellow-500/30 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="text-white font-medium">Data missing for {missingWeek}</h3>
                  <p className="text-gray-400 text-sm">Click below to add the missing data</p>
                </div>
              </div>
              <Button
                onClick={() => setIsAddingData(!isAddingData)}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Data
              </Button>
            </div>
            
            {isAddingData && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">New Customers</label>
                    <input
                      type="number"
                      value={quickInput.newCustomers}
                      onChange={(e) => setQuickInput({...quickInput, newCustomers: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Repeat Customers</label>
                    <input
                      type="number"
                      value={quickInput.repeatCustomers}
                      onChange={(e) => setQuickInput({...quickInput, repeatCustomers: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Revenue ($)</label>
                    <input
                      type="number"
                      value={quickInput.revenue}
                      onChange={(e) => setQuickInput({...quickInput, revenue: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Button
                    onClick={() => setIsAddingData(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleQuickInput}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                  >
                    Save Data
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customers Chart */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-teal-400" />
              Customers vs Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-center space-x-2">
              {quarterData.map((week, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-8 bg-teal-500/60 rounded-t" style={{ height: `${(week.newCustomers + week.repeatCustomers) / strategicGoals.quarterlyCustomers * 200}px` }}></div>
                  <div className="w-8 bg-blue-500/60 rounded-t mt-1" style={{ height: `${week.repeatCustomers / strategicGoals.quarterlyCustomers * 200}px` }}></div>
                  <div className="text-xs text-gray-400 mt-2">{week.week.split(' ')[1]}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-teal-500/60 rounded"></div>
                <span className="text-gray-300">New Customers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500/60 rounded"></div>
                <span className="text-gray-300">Repeat Customers</span>
              </div>
            </div>
            {/* Goal Line */}
            <div className="mt-4 border-t-2 border-dashed border-yellow-400/60 pt-2">
              <div className="text-center text-yellow-400 text-sm">Goal: {strategicGoals.quarterlyCustomers} customers</div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              Revenue vs Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-center space-x-2">
              {quarterData.map((week, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-8 bg-green-500/60 rounded-t" style={{ height: `${week.revenue / strategicGoals.quarterlyRevenue * 200}px` }}></div>
                  <div className="text-xs text-gray-400 mt-2">{week.week.split(' ')[1]}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-300">
              Weekly Revenue Progress
            </div>
            {/* Goal Line */}
            <div className="mt-4 border-t-2 border-dashed border-yellow-400/60 pt-2">
              <div className="text-center text-yellow-400 text-sm">Goal: ${strategicGoals.quarterlyRevenue.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-teal-400" />
            Weekly Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">Week</th>
                  <th className="text-left p-3 text-gray-300">New Customers</th>
                  <th className="text-left p-3 text-gray-300">Repeat Customers</th>
                  <th className="text-left p-3 text-gray-300">Total Customers</th>
                  <th className="text-left p-3 text-gray-300">Revenue ($)</th>
                  <th className="text-left p-3 text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {quarterData.map((week, index) => {
                  const totalCustomers = week.newCustomers + week.repeatCustomers
                  const hasData = week.newCustomers > 0 || week.repeatCustomers > 0 || week.revenue > 0
                  
                  return (
                    <tr key={index} className={`border-b border-gray-700 ${!hasData ? 'bg-red-500/10' : ''}`}>
                      <td className="p-3 text-white font-medium">{week.week}</td>
                      <td className="p-3 text-gray-300">{week.newCustomers}</td>
                      <td className="p-3 text-gray-300">{week.repeatCustomers}</td>
                      <td className="p-3 text-gray-300">{totalCustomers}</td>
                      <td className="p-3 text-gray-300">${week.revenue.toLocaleString()}</td>
                      <td className="p-3">
                        {!hasData ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Missing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Info */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Data sources: Audit Log (Weekly Priorities Workflow) • Strategic Goals • Weekly Inputs</p>
        <p className="mt-1">Changes in Audit Log automatically refresh dashboard • Goals sync from Strategic Goals section</p>
      </div>
    </div>
  )
}

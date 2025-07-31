"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, BarChart3, Plus, Filter, Search, TrendingUp } from "lucide-react"

const roadmapItems = [
  {
    id: 1,
    name: "Customer Portal Upgrade",
    status: "Not Started",
    priority: "High",
    startDate: "July 10, 2025",
    targetDate: "July 24, 2025",
    completion: "75%",
    dependencies: "API Integration",
    assignee: "Week",
    trend: "up",
  },
  {
    id: 2,
    name: "Website Redesign",
    status: "In Progress",
    priority: "High",
    startDate: "July 15, 2025",
    targetDate: "August 15, 2025",
    completion: "35%",
    dependencies: "Brand Guidelines Completion",
    assignee: "Week",
    trend: "up",
  },
  {
    id: 3,
    name: "Mobile App Launch",
    status: "Not Started",
    priority: "Medium",
    startDate: "July 22, 2025",
    targetDate: "September 30, 2025",
    completion: "0%",
    dependencies: "Website Redesign",
    assignee: "Week",
    trend: "neutral",
  },
]

export function RoadmapView() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30"
      case "In Progress":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30"
      case "Completed":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/30"
      default:
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-300 border border-orange-500/30"
      case "Low":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/30"
      default:
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30"
    }
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Header with glassmorphism */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Business Roadmap
              </h2>
              <p className="text-gray-400 text-sm">AI-powered strategic planning</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Enhanced View Controls */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            High Level Items
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <div className="flex-1"></div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-sm font-medium text-gray-300">
        <div className="col-span-3">Project Name & Tasks</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-2">Start Date</div>
        <div className="col-span-2">Target Date</div>
        <div className="col-span-1">Progress</div>
        <div className="col-span-2">Dependencies</div>
      </div>

      {/* Table Rows with enhanced styling */}
      <div className="divide-y divide-white/10">
        {roadmapItems.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="col-span-3 flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-purple-500/50 rounded-lg group-hover:border-purple-400 transition-colors duration-300"></div>
              <span className="font-medium text-white group-hover:text-purple-300 transition-colors duration-300">
                {item.name}
              </span>
              {item.trend === "up" && <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />}
            </div>
            <div className="col-span-1">
              <Badge className={`${getStatusColor(item.status)} rounded-xl font-medium`}>{item.status}</Badge>
            </div>
            <div className="col-span-1">
              <Badge className={`${getPriorityColor(item.priority)} rounded-xl font-medium`}>{item.priority}</Badge>
            </div>
            <div className="col-span-2 text-sm text-gray-300">{item.startDate}</div>
            <div className="col-span-2 text-sm text-gray-300">{item.targetDate}</div>
            <div className="col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: item.completion }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{item.completion}</span>
              </div>
            </div>
            <div className="col-span-2 text-sm text-gray-400">{item.dependencies}</div>
          </div>
        ))}

        {/* Enhanced Add New Task Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-gray-400 hover:bg-white/5 transition-all duration-300 group cursor-pointer">
          <div className="col-span-3 flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-dashed border-gray-500 rounded-lg group-hover:border-purple-400 transition-colors duration-300"></div>
            <span className="text-sm group-hover:text-purple-300 transition-colors duration-300 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add new task
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 
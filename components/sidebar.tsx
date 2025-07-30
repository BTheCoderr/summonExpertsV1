'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Grid3X3, FileText, Zap, Circle, Database, Workflow, Globe } from 'lucide-react'

const sidebarSections = [
  {
    title: 'Boards',
    items: [
      { name: 'Project Dashboard', icon: <Grid3X3 className="w-4 h-4" />, status: 'active' },
      { name: 'Task Kanban', icon: <Grid3X3 className="w-4 h-4" />, status: 'idle' },
      { name: 'Sprint Planning', icon: <Grid3X3 className="w-4 h-4" />, status: 'idle' }
    ]
  },
  {
    title: 'Notion Workspaces',
    items: [
      { name: 'Personal Wiki', icon: <FileText className="w-4 h-4" />, status: 'active' },
      { name: 'Team Docs', icon: <FileText className="w-4 h-4" />, status: 'active' },
      { name: 'Meeting Notes', icon: <FileText className="w-4 h-4" />, status: 'idle' },
      { name: 'Project Archive', icon: <Database className="w-4 h-4" />, status: 'idle' }
    ]
  },
  {
    title: 'Integrations',
    items: [
      { name: 'Slack Connector', icon: <Workflow className="w-4 h-4" />, status: 'active' },
      { name: 'GitHub Sync', icon: <Globe className="w-4 h-4" />, status: 'active' },
      { name: 'Calendar Bridge', icon: <Zap className="w-4 h-4" />, status: 'idle' }
    ]
  }
]

export function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Boards', 'Notion Workspaces', 'Integrations'])
  )

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedSections(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-400/80'
      case 'idle': return 'bg-gray-500/60'
      default: return 'bg-gray-500/60'
    }
  }

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-200">Command Hub</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-2">
        {sidebarSections.map((section) => {
          const isExpanded = expandedSections.has(section.title)
          
          return (
            <div key={section.title} className="mb-4">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <span>{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-gray-800/50 cursor-pointer group transition-all duration-200"
                    >
                      <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors flex-1">
                        {item.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)} shadow-sm`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Circle className="w-2 h-2 fill-current text-emerald-400" />
          <span>Connected to Notion</span>
        </div>
      </div>
    </div>
  )
} 
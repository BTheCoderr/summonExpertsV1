'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, ChevronDown, ChevronRight, FileText, Calendar, CheckSquare, Target, Lightbulb } from 'lucide-react'

interface NotionPanelProps {
  selectedPage: string
  onPageSelect: (page: string) => void
}

const pages = [
  { id: 'welcome', title: 'Welcome to NotionAI', icon: <Lightbulb className="w-4 h-4" />, type: 'page' },
  { id: 'projects', title: 'Projects', icon: <Target className="w-4 h-4" />, type: 'folder', children: [
    { id: 'project-alpha', title: 'Project Alpha', icon: <FileText className="w-4 h-4" /> },
    { id: 'project-beta', title: 'Project Beta', icon: <FileText className="w-4 h-4" /> }
  ]},
  { id: 'tasks', title: 'Task Management', icon: <CheckSquare className="w-4 h-4" />, type: 'page' },
  { id: 'calendar', title: 'Calendar & Planning', icon: <Calendar className="w-4 h-4" />, type: 'page' },
  { id: 'notes', title: 'Meeting Notes', icon: <FileText className="w-4 h-4" />, type: 'page' }
]

const pageContent: Record<string, any> = {
  'welcome': {
    title: 'Welcome to NotionAI',
    content: [
      { type: 'heading', text: 'Your AI-Powered Workspace' },
      { type: 'paragraph', text: 'This workspace combines the power of Notion with intelligent AI assistance. Use the AI assistant on the right to help with your content, planning, and productivity.' },
      { type: 'heading', text: 'What you can do:' },
      { type: 'bullet', text: 'Summarize long documents and meeting notes' },
      { type: 'bullet', text: 'Generate action items and to-do lists' },
      { type: 'bullet', text: 'Get explanations of complex topics' },
      { type: 'bullet', text: 'Brainstorm ideas for projects' },
      { type: 'bullet', text: 'Improve your writing and communication' }
    ]
  },
  'tasks': {
    title: 'Task Management',
    content: [
      { type: 'heading', text: 'Current Tasks' },
      { type: 'todo', text: 'Review project proposals', completed: false },
      { type: 'todo', text: 'Prepare presentation slides', completed: false },
      { type: 'todo', text: 'Schedule team meeting', completed: true },
      { type: 'todo', text: 'Update project timeline', completed: false },
      { type: 'heading', text: 'Upcoming Deadlines' },
      { type: 'paragraph', text: 'Project Alpha deadline: March 15th' },
      { type: 'paragraph', text: 'Quarterly review: March 30th' }
    ]
  },
  'calendar': {
    title: 'Calendar & Planning',
    content: [
      { type: 'heading', text: 'This Week' },
      { type: 'paragraph', text: 'Monday: Team standup at 9 AM' },
      { type: 'paragraph', text: 'Wednesday: Client presentation at 2 PM' },
      { type: 'paragraph', text: 'Friday: Project review meeting' },
      { type: 'heading', text: 'Goals for This Month' },
      { type: 'bullet', text: 'Complete Project Alpha milestone 1' },
      { type: 'bullet', text: 'Onboard new team member' },
      { type: 'bullet', text: 'Optimize workflow processes' }
    ]
  },
  'project-alpha': {
    title: 'Project Alpha',
    content: [
      { type: 'heading', text: 'Project Overview' },
      { type: 'paragraph', text: 'Project Alpha is our flagship initiative to revolutionize user experience through AI integration.' },
      { type: 'heading', text: 'Key Objectives' },
      { type: 'bullet', text: 'Implement AI-powered features' },
      { type: 'bullet', text: 'Improve user engagement by 40%' },
      { type: 'bullet', text: 'Launch beta version by Q2' },
      { type: 'heading', text: 'Current Status' },
      { type: 'paragraph', text: 'We are currently in the development phase, with 60% of core features completed.' }
    ]
  }
}

export function NotionPanel({ selectedPage, onPageSelect }: NotionPanelProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['projects']))
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const renderPageTree = (pages: any[], depth = 0) => {
    return pages.map((page) => {
      const isExpanded = expandedFolders.has(page.id)
      
      return (
        <div key={page.id}>
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer rounded-lg mx-2 ${
              selectedPage === page.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            style={{ paddingLeft: `${12 + depth * 20}px` }}
            onClick={() => {
              if (page.type === 'folder') {
                toggleFolder(page.id)
              } else {
                onPageSelect(page.id)
              }
            }}
          >
            {page.type === 'folder' && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )
            )}
            {page.icon}
            <span className="text-sm font-medium">{page.title}</span>
          </div>
          {page.type === 'folder' && isExpanded && page.children && (
            <div className="mt-1">
              {renderPageTree(page.children, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  const renderContent = (content: any[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'heading':
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">
              {item.text}
            </h2>
          )
        case 'paragraph':
          return (
            <p key={index} className="text-gray-700 mb-4 leading-relaxed">
              {item.text}
            </p>
          )
        case 'bullet':
          return (
            <div key={index} className="flex items-start space-x-3 mb-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
              <span className="text-gray-700">{item.text}</span>
            </div>
          )
        case 'todo':
          return (
            <div key={index} className="flex items-center space-x-3 mb-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                item.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}>
                {item.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {item.text}
              </span>
            </div>
          )
        default:
          return null
      }
    })
  }

  const currentPage = pageContent[selectedPage] || pageContent['welcome']

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Notion Workspace</h1>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Pages
            </div>
            {renderPageTree(pages)}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              {currentPage.title}
            </h1>
            <div className="prose prose-lg max-w-none">
              {renderContent(currentPage.content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, CheckSquare, HelpCircle, Sparkles, Loader2, Brain, Zap, PenTool } from 'lucide-react'

interface Command {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
}

const commands: Command[] = [
  {
    id: 'summarize',
    title: 'Summarize Page',
    description: 'Generate a concise summary of the current page content',
    icon: <FileText className="w-4 h-4" />,
    category: 'Content'
  },
  {
    id: 'generate-todo',
    title: 'Generate To-Do',
    description: 'Create actionable tasks from the selected content',
    icon: <CheckSquare className="w-4 h-4" />,
    category: 'Productivity'
  },
  {
    id: 'explain-section',
    title: 'Explain This Section',
    description: 'Get a detailed explanation of complex topics',
    icon: <HelpCircle className="w-4 h-4" />,
    category: 'Learning'
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm Ideas',
    description: 'Generate creative ideas and suggestions',
    icon: <Brain className="w-4 h-4" />,
    category: 'Creative'
  },
  {
    id: 'improve-writing',
    title: 'Improve Writing',
    description: 'Enhance grammar, style, and clarity',
    icon: <PenTool className="w-4 h-4" />,
    category: 'Writing'
  },
  {
    id: 'quick-action',
    title: 'Quick Action',
    description: 'Perform common tasks instantly',
    icon: <Zap className="w-4 h-4" />,
    category: 'Productivity'
  }
]

interface CommandPaletteProps {
  onCommandExecute: (command: string, result: string) => void
  searchQuery: string
}

export function CommandPalette({ onCommandExecute, searchQuery }: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCommandSelect = async (command: Command) => {
    setIsLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const responses = {
      'summarize': 'This workspace provides an AI-powered command interface with multiple layout options. Users can switch between single, dual, and triple panel views to customize their workflow.',
      'generate-todo': '• Set up workspace layout preferences\n• Explore command palette features\n• Test AI chat functionality\n• Organize results panel\n• Customize keyboard shortcuts',
      'explain-section': 'The command palette allows quick access to AI tools through a searchable interface. Commands are categorized and can be executed with keyboard shortcuts or mouse clicks.',
      'brainstorm': '• Interactive AI workspace concepts\n• Multi-panel productivity tools\n• Command-driven interfaces\n• Customizable layout systems\n• Real-time collaboration features',
      'improve-writing': 'Consider enhancing clarity by using active voice, shorter sentences, and more specific terminology. The current text is well-structured but could benefit from more concrete examples.',
      'quick-action': 'Quick action executed successfully! This demonstrates how instant commands can streamline your workflow without interrupting your focus.'
    }
    
    const result = responses[command.id as keyof typeof responses] || 'Command executed successfully!'
    onCommandExecute(command.title, result)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      {isLoading && (
        <div className="flex items-center justify-center py-8 border-b border-gray-100">
          <div className="flex items-center space-x-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing command...</span>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {filteredCommands.length > 0 ? (
          <div className="p-3 space-y-1">
            {filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => handleCommandSelect(command)}
                disabled={isLoading}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
                  index === selectedIndex
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  {command.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{command.title}</div>
                  <div className="text-sm text-gray-500">{command.description}</div>
                </div>
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                  {command.category}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p>No commands found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
} 
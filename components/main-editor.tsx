'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Circle } from 'lucide-react'

interface MainEditorProps {
  activeFile: string
}

const fileContents: Record<string, string> = {
  'welcome.md': `# Welcome to NotionAI Workspace

This is your AI-powered workspace for enhanced productivity.

## Features

- **Command Palette**: Quick access to AI commands
- **Smart Chat**: Conversational AI assistant
- **Multi-panel Layout**: Customizable workspace
- **File Management**: Organize your work

## Getting Started

1. Use the command palette to execute AI commands
2. Chat with the AI assistant in the right panel
3. View results and manage your workspace
4. Customize the layout to fit your workflow

## Commands Available

- Summarize content
- Generate to-do lists
- Explain complex topics
- Brainstorm ideas
- Improve writing

Start by typing in the command palette or chatting with the AI!`,
  'package.json': `{
  "name": "notion-ai-workspace",
  "version": "1.0.0",
  "description": "AI-powered workspace for enhanced productivity",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.0.0"
  }
}`,
  'README.md': `# NotionAI Workspace

A modern, AI-powered workspace built with Next.js and Tailwind CSS.

## Features

- Multi-panel interface
- AI command palette
- Smart chat assistant
- File management
- Customizable layout

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Usage

Open the workspace and start using AI commands to enhance your productivity.`
}

export function MainEditor({ activeFile }: MainEditorProps) {
  const [openTabs, setOpenTabs] = useState(['welcome.md'])
  const [activeTab, setActiveTab] = useState('welcome.md')

  const openFile = (filename: string) => {
    if (!openTabs.includes(filename)) {
      setOpenTabs([...openTabs, filename])
    }
    setActiveTab(filename)
  }

  const closeTab = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = openTabs.filter(tab => tab !== filename)
    setOpenTabs(newTabs)
    if (activeTab === filename && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1])
    }
  }

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.md')) return '📝'
    if (filename.endsWith('.json')) return '⚙️'
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return '⚛️'
    return '📄'
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Tabs */}
      <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {openTabs.map((tab) => (
          <div
            key={tab}
            className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
              activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="text-sm">{getFileIcon(tab)}</span>
            <span className="text-sm truncate">{tab}</span>
            {openTabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-gray-400 hover:text-gray-200"
                onClick={(e) => closeTab(tab, e)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <Circle className="w-2 h-2 fill-current text-gray-500" />
          </div>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full bg-gray-900 text-gray-100">
          <div className="flex">
            {/* Line Numbers */}
            <div className="bg-gray-800 text-gray-500 text-sm font-mono px-4 py-4 select-none border-r border-gray-700">
              {fileContents[activeTab]?.split('\n').map((_, index) => (
                <div key={index} className="leading-6 text-right">
                  {index + 1}
                </div>
              ))}
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4">
              <pre className="text-sm font-mono leading-6 whitespace-pre-wrap text-gray-100">
                {fileContents[activeTab] || `// ${activeTab}\n\n// File content would go here...`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
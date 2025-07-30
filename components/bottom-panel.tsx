'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Terminal, AlertCircle, CheckCircle, Info, X } from 'lucide-react'

type TabType = 'terminal' | 'problems' | 'output'

const terminalOutput = [
  '$ npm run dev',
  '',
  '> notion-ai-workspace@1.0.0 dev',
  '> next dev',
  '',
  '- ready started server on 0.0.0.0:3000, url: http://localhost:3000',
  '- info Loaded env from .env.local',
  '- event compiled client and server successfully in 2.1s (306 modules)',
  '- wait compiling...',
  '- event compiled client and server successfully in 426ms (306 modules)',
  '- info Fast Refresh enabled for 1 file',
  ''
]

const problems = [
  { type: 'error', message: 'Expression expected', file: 'app/page.tsx', line: 211, column: 1 },
  { type: 'warning', message: 'Unused variable "result"', file: 'components/ai-chat.tsx', line: 45, column: 12 },
  { type: 'info', message: 'Consider using const assertion', file: 'lib/utils.ts', line: 23, column: 8 }
]

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('terminal')

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'terminal': return <Terminal className="w-4 h-4" />
      case 'problems': return <AlertCircle className="w-4 h-4" />
      case 'output': return <Info className="w-4 h-4" />
    }
  }

  const getProblemIcon = (type: string) => {
    switch (type) {
      case 'error': return <X className="w-4 h-4 text-red-400" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'info': return <Info className="w-4 h-4 text-blue-400" />
      default: return <Info className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {(['terminal', 'problems', 'output'] as TabType[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-none border-r border-gray-700 flex items-center space-x-2 h-8 ${
              activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabIcon(tab)}
            <span className="capitalize">{tab}</span>
            {tab === 'problems' && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {problems.filter(p => p.type === 'error').length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-900 text-gray-100">
        {activeTab === 'terminal' && (
          <div className="p-4 font-mono text-sm">
            {terminalOutput.map((line, index) => (
              <div key={index} className="leading-6">
                {line || '\u00A0'}
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-green-400">$</span>
              <div className="ml-2 w-2 h-5 bg-gray-400 animate-pulse"></div>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="p-4">
            {problems.map((problem, index) => (
              <div key={index} className="flex items-start space-x-3 py-2 hover:bg-gray-800 cursor-pointer">
                {getProblemIcon(problem.type)}
                <div className="flex-1">
                  <div className="text-sm text-gray-200">{problem.message}</div>
                  <div className="text-xs text-gray-500">
                    {problem.file}:{problem.line}:{problem.column}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="p-4 font-mono text-sm">
            <div className="text-gray-400">[AI Assistant Output]</div>
            <div className="mt-2">
              <div className="text-green-400">✓ AI services initialized</div>
              <div className="text-blue-400">ℹ Command palette ready</div>
              <div className="text-green-400">✓ Chat interface connected</div>
              <div className="text-gray-300">Ready for AI interactions...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
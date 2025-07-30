'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AIChat } from '@/components/ai-chat'
import { ResultsPanel } from '@/components/results-panel'
import { Search, MessageSquare, FileText, Settings, Maximize2, Minimize2, PanelLeftClose, PanelRightClose, Grid3X3, CheckSquare, HelpCircle } from 'lucide-react'

type LayoutMode = 'single' | 'dual' | 'triple'
type ActivePanel = 'commands' | 'chat' | 'results'

interface AIWorkspaceProps {
  isOpen: boolean
  onClose: () => void
}

export function AIWorkspace({ isOpen, onClose }: AIWorkspaceProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single')
  const [activePanel, setActivePanel] = useState<ActivePanel>('commands')
  const [searchQuery, setSearchQuery] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string}>>([])
  const [results, setResults] = useState<Array<{id: string, title: string, content: string, timestamp: Date}>>([])

  const handleCommandExecute = (command: string, result: string) => {
    // Add to chat
    setChatMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: command },
      { id: (Date.now() + 1).toString(), type: 'ai', content: result }
    ])
    
    // Add to results
    setResults(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: command,
        content: result,
        timestamp: new Date()
      }
    ])

    // Switch to appropriate view
    if (layoutMode === 'single') {
      setActivePanel('results')
    }
  }

  const handleChatMessage = (message: string, response: string) => {
    setChatMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: message },
      { id: (Date.now() + 1).toString(), type: 'ai', content: response }
    ])
  }

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  const renderSinglePanel = () => {
    switch (activePanel) {
      case 'commands':
        return <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">AI Commands</h3>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleCommandExecute('Summarize content', 'Content summarized successfully!')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Summarize Content
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleCommandExecute('Generate tasks', 'Tasks generated successfully!')}
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Generate Tasks
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleCommandExecute('Explain concepts', 'Concepts explained successfully!')}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Explain Concepts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      case 'chat':
        return <AIChat messages={chatMessages} onSendMessage={handleChatMessage} />
      case 'results':
        return <ResultsPanel results={results} />
      default:
        return <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">AI Commands</h3>
          </div>
          <div className="flex-1 p-4">
            <p className="text-gray-500">Select a command to get started</p>
          </div>
        </div>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[85vh] p-0 gap-0 rounded-2xl border-0 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search or type a command..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 border-0 bg-white focus-visible:ring-1 focus-visible:ring-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Layout Controls */}
              <div className="flex items-center space-x-1 bg-white rounded-xl p-1 border border-gray-200">
                <Button
                  variant={layoutMode === 'single' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLayoutMode('single')}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={layoutMode === 'dual' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLayoutMode('dual')}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
                <Button
                  variant={layoutMode === 'triple' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLayoutMode('triple')}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {layoutMode === 'single' && (
              <div className="flex-1 flex flex-col">
                {/* Single Panel Navigation */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <Button
                    variant={activePanel === 'commands' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActivePanel('commands')}
                    className="rounded-none border-r border-gray-200 flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Commands</span>
                  </Button>
                  <Button
                    variant={activePanel === 'chat' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActivePanel('chat')}
                    className="rounded-none border-r border-gray-200 flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </Button>
                  <Button
                    variant={activePanel === 'results' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActivePanel('results')}
                    className="rounded-none flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Results ({results.length})</span>
                  </Button>
                </div>
                <div className="flex-1">
                  {renderSinglePanel()}
                </div>
              </div>
            )}

            {layoutMode === 'dual' && (
              <>
                <div className="w-1/2 border-r border-gray-200">
                  <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 text-sm font-medium text-gray-700">
                    Commands
                  </div>
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-4">
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleCommandExecute('Summarize content', 'Content summarized successfully!')}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Summarize Content
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleCommandExecute('Generate tasks', 'Tasks generated successfully!')}
                            >
                              <CheckSquare className="w-4 h-4 mr-2" />
                              Generate Tasks
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleCommandExecute('Explain concepts', 'Concepts explained successfully!')}
                            >
                              <HelpCircle className="w-4 h-4 mr-2" />
                              Explain Concepts
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 text-sm font-medium text-gray-700">
                    Results ({results.length})
                  </div>
                  <ResultsPanel results={results} />
                </div>
              </>
            )}

            {layoutMode === 'triple' && (
              <>
                <div className="w-1/3 border-r border-gray-200">
                  <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 text-sm font-medium text-gray-700">
                    Commands
                  </div>
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-4">
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleCommandExecute('Summarize content', 'Content summarized successfully!')}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Summarize Content
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleCommandExecute('Generate tasks', 'Tasks generated successfully!')}
                            >
                              <CheckSquare className="w-4 h-4 mr-2" />
                              Generate Tasks
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => handleCommandExecute('Explain concepts', 'Concepts explained successfully!')}
                            >
                              <HelpCircle className="w-4 h-4 mr-2" />
                              Explain Concepts
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 border-r border-gray-200">
                  <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 text-sm font-medium text-gray-700">
                    Chat
                  </div>
                  <AIChat messages={chatMessages} onSendMessage={handleChatMessage} />
                </div>
                <div className="w-1/3">
                  <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 text-sm font-medium text-gray-700">
                    Results ({results.length})
                  </div>
                  <ResultsPanel results={results} />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
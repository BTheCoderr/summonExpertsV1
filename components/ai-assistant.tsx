'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User, Sparkles, FileText, CheckSquare, HelpCircle, Lightbulb, Zap, Copy, X } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

const quickCommands = [
  { icon: <FileText className="w-4 h-4" />, label: 'Summarize', command: 'Summarize the current page content' },
  { icon: <CheckSquare className="w-4 h-4" />, label: 'Create Tasks', command: 'Generate a to-do list from this content' },
  { icon: <HelpCircle className="w-4 h-4" />, label: 'Explain', command: 'Explain the key concepts on this page' },
  { icon: <Lightbulb className="w-4 h-4" />, label: 'Brainstorm', command: 'Help me brainstorm ideas for this project' },
  { icon: <Zap className="w-4 h-4" />, label: 'Improve', command: 'Suggest improvements for this content' }
]

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI assistant for the workspace. I can help you:\n\n• Summarize your pages and documents\n• Generate to-do lists and action items\n• Explain complex concepts\n• Brainstorm ideas for your projects\n• Improve your content and writing\n\nWhat would you like help with today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message?: string) => {
    const messageToSend = message || inputValue.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))

    const aiResponses = {
      'summarize': 'Here\'s a summary of your current workspace:\n\n**Key Points:**\n• Main focus is on AI-powered workspace integration\n• Combines productivity tools with intelligent assistance\n• Enables enhanced collaboration through automated workflows\n\n**Action Items:**\n• Explore AI features for content creation\n• Set up automated workflows\n• Integrate with existing project management tools',
      'tasks': '**Generated To-Do List:**\n\n✅ **High Priority:**\n• Review and update project timeline\n• Schedule team alignment meeting\n• Finalize project requirements\n\n📋 **Medium Priority:**\n• Create project documentation\n• Set up progress tracking\n• Prepare status report\n\n💡 **Nice to Have:**\n• Explore automation opportunities\n• Research best practices\n• Plan team training session',
      'explain': 'Let me break down the key concepts:\n\n**AI-Powered Workspace:**\nThis refers to integrating artificial intelligence into your daily workflow to automate repetitive tasks and enhance decision-making.\n\n**Benefits:**\n• Faster content creation and editing\n• Automated task generation\n• Intelligent content suggestions\n• Enhanced productivity through smart assistance\n\n**Implementation:**\nThe AI assistant works alongside your workspace tools to provide contextual help and suggestions.',
      'brainstorm': '💡 **Creative Ideas for Your Project:**\n\n**Feature Enhancements:**\n• Smart templates that adapt to your content\n• Automated progress tracking\n• AI-powered content suggestions\n• Intelligent task prioritization\n\n**Process Improvements:**\n• Streamlined workflow automation\n• Enhanced collaboration tools\n• Real-time feedback integration\n• Predictive project planning\n\n**Innovation Opportunities:**\n• Voice-to-text integration\n• Smart content categorization\n• Automated meeting summaries',
      'improve': '🚀 **Suggestions to Enhance Your Content:**\n\n**Structure Improvements:**\n• Add clear section headers for better navigation\n• Include progress indicators for tasks\n• Create visual hierarchy with bullet points\n\n**Content Enhancements:**\n• Add specific deadlines to action items\n• Include success metrics for goals\n• Provide context for each project phase\n\n**Productivity Tips:**\n• Use templates for recurring content\n• Set up automated reminders\n• Create linked databases for better organization'
    }

    // Determine response based on message content
    let response = "I'd be happy to help! Could you provide more specific details about what you'd like assistance with?"
    
    const lowerMessage = messageToSend.toLowerCase()
    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      response = aiResponses.summarize
    } else if (lowerMessage.includes('task') || lowerMessage.includes('todo') || lowerMessage.includes('to-do')) {
      response = aiResponses.tasks
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does')) {
      response = aiResponses.explain
    } else if (lowerMessage.includes('brainstorm') || lowerMessage.includes('ideas') || lowerMessage.includes('creative')) {
      response = aiResponses.brainstorm
    } else if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('enhance')) {
      response = aiResponses.improve
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, aiMessage])
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center animate-float">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-xs text-gray-500">Ready to help with your workspace</p>
            </div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Commands</p>
          <div className="grid grid-cols-1 gap-1">
            {quickCommands.map((cmd, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 justify-start text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                onClick={() => handleSend(cmd.command)}
              >
                {cmd.icon}
                <span className="ml-2">{cmd.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div className={`flex-1 max-w-[85%] ${
              message.type === 'user' ? 'text-right' : ''
            }`}>
              <div className={`inline-block p-3 rounded-2xl relative group ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
              }`}>
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{message.content}</pre>
                {message.type === 'ai' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI about your workspace..."
            disabled={isLoading}
            className="flex-1 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 
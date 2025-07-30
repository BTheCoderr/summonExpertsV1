"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Brain, Zap, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Summon Experts</span>
          </div>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => window.location.href = '/dashboard'}>
            Try Command Palette
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            ⚡ AI-Powered Assistant
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered{" "}
            <span className="text-purple-600">Business Planning</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your business ideas into actionable plans with AI. Generate strategic roadmaps, weekly tasks, and comprehensive business strategies—all powered by advanced AI.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3" onClick={() => window.location.href = '/dashboard'}>
              Get Started →
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3" onClick={() => window.location.href = '/demo'}>
              Demo
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3" onClick={() => window.location.href = '/test-notion'}>
              Test Notion
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3" onClick={() => window.location.href = '/debug'}>
              Debug CSS
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            Press / to open command palette
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Planning</h3>
            <p className="text-gray-600">
              Generate comprehensive business strategies and roadmaps tailored to your specific goals and timeline.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Task Management</h3>
            <p className="text-gray-600">
              Get personalized weekly task plans with detailed subtasks and execution guidance.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your progress with weekly audits, milestone tracking, and performance analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 
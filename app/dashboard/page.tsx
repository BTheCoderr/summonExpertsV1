"use client"

import { useState } from "react"
import { TopHeader } from "@/components/top-header"
import { NavigationTabs } from "@/components/navigation-tabs"
import { HeroBanner } from "@/components/hero-banner"
import { RoadmapView } from "@/components/roadmap-view"
import { RightSidebar } from "@/components/right-sidebar"
import { ChatOverlay } from "@/components/chat-overlay"

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content with backdrop blur */}
      <div className="relative z-10">
        {/* Top Header */}
        <TopHeader />

        {/* Navigation Tabs */}
        <NavigationTabs />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Main Content Area */}
        <div className="flex p-6 gap-6">
          {/* Main Content - Notion Interface */}
          <div className="flex-1">
            <RoadmapView />
          </div>

          {/* Right Sidebar */}
          <div className="w-80">
            <RightSidebar onStartChat={() => setIsChatOpen(true)} />
          </div>
        </div>
      </div>

      {/* Chat Overlay */}
      {isChatOpen && <ChatOverlay onClose={() => setIsChatOpen(false)} />}
    </div>
  )
} 
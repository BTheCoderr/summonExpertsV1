"use client"

import { Button } from "@/components/ui/button"
import { Check, X, MessageSquare, Sparkles, Brain, Zap } from "lucide-react"

interface RightSidebarProps {
  onStartChat: () => void
}

export function RightSidebar({ onStartChat }: RightSidebarProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 h-full shadow-2xl">
      {/* Enhanced Update Button */}
      <Button className="w-full mb-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-white border border-teal-500/30 hover:border-teal-400/50 transition-all duration-300 rounded-xl backdrop-blur-sm">
        <Zap className="w-4 h-4 mr-2" />
        Update my roadmap
      </Button>

      {/* Content Section with glassmorphism */}
      <div className="space-y-6">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            [AI Insight] The Review Council's Role in the Adaptive Strategy Loop
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <h4 className="font-medium text-cyan-300">Why It Matters</h4>
              </div>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p className="opacity-90">Founders often build based on assumptions that break down.</p>
                <p className="opacity-90">Strategy must evolve based on real progress, obstacles, or user feedback.</p>
                <p className="opacity-90">A formal review mechanism gives structure to adaptation — not chaos.</p>
              </div>
            </div>

            {/* Enhanced Apply Section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-teal-400" />
                  Apply?
                </span>
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 rounded-xl backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Start Chat Button */}
        <div className="border-t border-white/10 pt-6">
          <Button
            onClick={onStartChat}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
          >
            <MessageSquare className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Start a new session
          </Button>
        </div>
      </div>
    </div>
  )
} 
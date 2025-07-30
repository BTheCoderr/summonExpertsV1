"use client"

import { Button } from "@/components/ui/button"
import { Home, FileText, ChevronRight } from "lucide-react"

export function NavigationTabs() {
  return (
    <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="px-6 py-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Daniela Adriana's Workspace
          </Button>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <Button
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300 rounded-xl bg-cyan-500/5 border border-cyan-500/20"
          >
            <FileText className="w-4 h-4 mr-2" />
            Business Roadmap
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-1 ml-2">Edited Jul 20 • Live sync enabled</div>
      </div>
    </div>
  )
} 
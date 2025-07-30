'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search, Settings, Maximize2, Minimize2, X } from 'lucide-react'

export function TopBar() {
  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
      {/* Traffic Lights */}
      <div className="flex items-center space-x-2 mr-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center space-x-2 mr-4">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search or type a command..."
            className="bg-gray-700 border-gray-600 text-gray-200 pl-10 h-8 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200">
          <Minimize2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200">
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 
'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Building, 
  Target, 
  LogOut, 
  Home,
  Settings,
  Plus
} from 'lucide-react'

export default function PlatformNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    {
      label: 'Create Account',
      icon: User,
      href: '/platform/account',
      description: 'Set up your account'
    },
    {
      label: 'Log-in',
      icon: User,
      href: '/platform/login',
      description: 'Access your account'
    },
    {
      label: 'Business Setup',
      icon: Building,
      href: '/platform/business-setup',
      description: 'Configure your business'
    },
    {
      label: 'Growth Plan',
      icon: Target,
      href: '/platform/growth-plan',
      description: 'Plan your growth strategy'
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SE</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Summon Experts</h1>
              <p className="text-teal-400 text-sm">AI-Powered Business Planning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-teal-400 border-teal-500/30 hover:bg-teal-500/10"
              onClick={() => router.push('/platform')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-teal-400 border-teal-500/30 hover:bg-teal-500/10"
              onClick={() => router.push('/platform/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1">
          <span className="text-teal-400 text-sm font-medium mr-4">Forms:</span>
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <React.Fragment key={item.label}>
                {index > 0 && (
                  <div className="w-px h-6 bg-white/20 mx-2" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 border-2 border-white text-white' 
                      : 'bg-gray-800/50 border border-teal-500/30 text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}


'use client'

import React from 'react'
import { ThemeProvider } from '../theme-provider'

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {children}
      </div>
    </ThemeProvider>
  )
}


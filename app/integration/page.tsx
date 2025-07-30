'use client'

import { NotionIntegration } from '@/components/notion-integration'
import { useSearchParams } from 'next/navigation'

export default function IntegrationPage() {
  const searchParams = useSearchParams()
  const pageId = searchParams.get('pageId') || undefined
  const initialPrompt = searchParams.get('prompt') || ''

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NotionIntegration 
        pageId={pageId}
        initialPrompt={initialPrompt}
        onResponse={(response) => {
          // Handle response if needed
          console.log('AI Response:', response)
        }}
      />
    </div>
  )
} 
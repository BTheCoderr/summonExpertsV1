import { NotionTest } from '@/components/notion-test'

export default function TestNotionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notion Integration Test
          </h1>
          <p className="text-gray-600">
            Test your Notion integration with real API calls
          </p>
        </div>
        
        <NotionTest />
      </div>
    </div>
  )
} 
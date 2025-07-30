import { YCNotionIntegration } from '@/components/yc-notion-integration'

export default function YCPrototypeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            YC Submission Prototype - Notion Integration Test
          </h1>
          <p className="text-gray-600">
            Test the Notion integration with your bakery business plan
          </p>
        </div>
        
        <YCNotionIntegration />
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            🎯 YC Submission Demo Instructions
          </h2>
          <div className="space-y-3 text-blue-800">
            <p><strong>1. Connect to Your Notion Page:</strong> Enter the page ID from your bakery business plan Notion page.</p>
            <p><strong>2. Test the Integration:</strong> Use the buttons to read, write, and create AI-generated content.</p>
            <p><strong>3. Generate Strategic Plan:</strong> Click "Generate Strategic Plan" to create a comprehensive business strategy.</p>
            <p><strong>4. Demo the Features:</strong> Show how the AI can enhance your Notion workspace with intelligent content generation.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 
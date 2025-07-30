export default function CSSTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">CSS Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Tailwind Classes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Tailwind</h2>
            <div className="space-y-3">
              <div className="bg-blue-500 text-white p-3 rounded">Blue Background</div>
              <div className="bg-green-500 text-white p-3 rounded">Green Background</div>
              <div className="bg-red-500 text-white p-3 rounded">Red Background</div>
            </div>
          </div>

          {/* Custom CSS Variables */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CSS Variables</h2>
            <div className="space-y-3">
              <div className="bg-primary text-primary-foreground p-3 rounded">Primary</div>
              <div className="bg-secondary text-secondary-foreground p-3 rounded">Secondary</div>
              <div className="bg-muted text-muted-foreground p-3 rounded">Muted</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
            <div className="space-y-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Primary Button
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cards</h2>
            <div className="space-y-3">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Card Title</h3>
                <p className="text-gray-600">Card content goes here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation Links</h2>
          <div className="flex space-x-4">
            <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
            <a href="/yc-prototype" className="text-blue-600 hover:text-blue-800">YC Prototype</a>
            <a href="/test-notion" className="text-blue-600 hover:text-blue-800">Test Notion</a>
          </div>
        </div>
      </div>
    </div>
  )
} 
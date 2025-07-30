export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">CSS Debug Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tailwind Classes Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <h3 className="font-bold">Blue Card</h3>
              <p>This should have a blue background</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <h3 className="font-bold">Green Card</h3>
              <p>This should have a green background</p>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg">
              <h3 className="font-bold">Red Card</h3>
              <p>This should have a red background</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Button Test</h2>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Primary Button
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg">
              Secondary Button
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
              Danger Button
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography Test</h2>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Heading 1</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Heading 2</h2>
            <h3 className="text-xl font-medium text-gray-700">Heading 3</h3>
            <p className="text-base text-gray-600">This is a paragraph with normal text.</p>
            <p className="text-sm text-gray-500">This is smaller text.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Elements Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Field
              </label>
              <input 
                type="text" 
                placeholder="Enter some text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Textarea
              </label>
              <textarea 
                placeholder="Enter some text"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation Test</h2>
          <div className="flex space-x-4">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">Home</a>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800 underline">Dashboard</a>
            <a href="/yc-prototype" className="text-blue-600 hover:text-blue-800 underline">YC Prototype</a>
            <a href="/test-notion" className="text-blue-600 hover:text-blue-800 underline">Test Notion</a>
            <a href="/css-test" className="text-blue-600 hover:text-blue-800 underline">CSS Test</a>
          </div>
        </div>
      </div>
    </div>
  )
} 
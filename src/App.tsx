export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">AP TOOLS</h1>
        <p className="text-lg text-gray-600 mb-6">All your tools. One place.</p>
        <div className="max-w-md mx-auto p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
          <p className="text-sm text-amber-800 font-medium mb-1">⚠️ Source code missing</p>
          <p className="text-sm text-amber-700">
            The full <code className="bg-amber-100 px-1 rounded">src/</code> folder was not present in the repository.
            This is a temporary placeholder so the Cloudflare build can succeed.
            Please push the complete source code to restore all tools.
          </p>
        </div>
      </div>
    </div>
  )
}

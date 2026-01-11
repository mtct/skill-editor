export function ValidationToast({ errors, onClose }) {
  if (!errors || errors.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-danger-50 border border-danger-600 rounded-lg shadow-elevation-8 p-4">
      <div className="flex items-start gap-3">
        <span className="text-danger-600 text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-semibold text-danger-700 mb-2 text-sm">
            Validation errors
          </h3>
          <ul className="text-sm text-danger-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-danger-600 hover:bg-danger-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-danger-600 transition-all duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

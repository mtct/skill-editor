export function ValidationToast({ errors, onClose }) {
  if (!errors || errors.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-medium text-red-800 mb-1">
            Errori di validazione
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

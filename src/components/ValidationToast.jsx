import { MESSAGES } from '../constants/messages'

export function ValidationToast({ errors, onClose }) {
  if (!errors || errors.length === 0) return null

  return (
    <div role="alert" className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md bg-danger-50 border border-danger-600 rounded-xl shadow-elevation-8 p-4">
      <div className="flex items-start gap-3">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-danger-600 flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-danger-700 mb-2 text-sm">
            {MESSAGES.VALIDATION_TITLE}
          </h3>
          <ul className="text-sm text-danger-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          aria-label={MESSAGES.VALIDATION_CLOSE}
          className="p-1 rounded text-danger-600 hover:bg-danger-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-danger-600 transition-all duration-200"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  )
}

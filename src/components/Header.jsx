import { MESSAGES } from '../constants/messages'

export function Header({ fileName, onSave, isSaving, isModified }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-200 bg-surface-0 shadow-elevation-1">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-surface-900">
          {fileName}
        </h1>
        {isModified && (
          <span className="text-xs text-surface-700 font-medium">(modified)</span>
        )}
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className={`
          px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
          ${isSaving
            ? 'bg-surface-100 text-surface-700 shadow-elevation-1 cursor-not-allowed opacity-60'
            : 'bg-success-600 text-white shadow-elevation-2 hover:bg-success-700 hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-success-600 focus:ring-offset-2 active:scale-[0.98] active:shadow-elevation-1'
          }
        `}
      >
        {isSaving ? MESSAGES.SAVING : MESSAGES.SAVE_BUTTON}
      </button>
    </header>
  )
}

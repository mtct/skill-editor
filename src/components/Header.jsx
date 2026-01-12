import { MESSAGES } from '../constants/messages'

export function Header({ fileName, onSave, onClose, isSaving, isModified }) {
  const handleClose = () => {
    if (isModified) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-surface-200 bg-surface-0 shadow-elevation-1">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-surface-900">
          {fileName}
        </h1>
        {isModified && (
          <span className="text-xs text-surface-700 font-medium">(modified)</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleClose}
          className="px-5 py-2.5 rounded-md font-medium text-base bg-surface-100 text-surface-900 shadow-elevation-1 hover:bg-surface-200 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-surface-700 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200"
        >
          CLOSE
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className={`
            px-5 py-2.5 rounded-md font-medium text-base transition-all duration-200
            ${isSaving
              ? 'bg-surface-100 text-surface-700 shadow-elevation-1 cursor-not-allowed opacity-60'
              : 'bg-success-600 text-white shadow-elevation-2 hover:bg-success-700 hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-success-600 focus:ring-offset-2 active:scale-[0.98] active:shadow-elevation-1'
            }
          `}
        >
          {isSaving ? MESSAGES.SAVING : MESSAGES.SAVE_BUTTON}
        </button>
      </div>
    </header>
  )
}

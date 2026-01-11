import { MESSAGES } from '../constants/messages'

export function Header({ fileName, onSave, isSaving, isModified }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium text-gray-800">
          {fileName}
        </h1>
        {isModified && (
          <span className="text-xs text-gray-500">(modificato)</span>
        )}
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className={`
          px-4 py-2 rounded-md font-medium text-sm
          transition-colors duration-200
          ${isSaving
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
          }
        `}
      >
        {isSaving ? MESSAGES.SAVING : MESSAGES.SAVE_BUTTON}
      </button>
    </header>
  )
}

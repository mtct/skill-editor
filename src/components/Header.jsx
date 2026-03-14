import { MESSAGES } from '../constants/messages'

export function Header({ fileName, onSave, onClose, isSaving, isModified, isSidebarOpen, onToggleSidebar, theme, onToggleTheme }) {
  const handleClose = () => {
    if (isModified) {
      if (window.confirm(MESSAGES.UNSAVED_CHANGES_CONFIRM)) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <header className="flex items-center justify-between px-3 py-3 border-b border-surface-200 bg-surface-0 shadow-elevation-1 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — only visible on mobile */}
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? MESSAGES.TOGGLE_SIDEBAR_CLOSE : MESSAGES.TOGGLE_SIDEBAR_OPEN}
          aria-expanded={isSidebarOpen}
          className="md:hidden flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-md text-surface-700 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>

        <h1 className="text-base md:text-lg font-semibold text-surface-900 truncate min-w-0">
          {fileName}
        </h1>
        <span aria-live="polite" className="flex-shrink-0 text-xs text-surface-700 font-medium">
          {isModified ? MESSAGES.MODIFIED_INDICATOR : ''}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? MESSAGES.TOGGLE_LIGHT : MESSAGES.TOGGLE_DARK}
          className="w-9 h-9 flex items-center justify-center rounded-md text-surface-700 hover:bg-surface-100 hover:text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          {theme === 'dark' ? (
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <button
          onClick={handleClose}
          className="px-3 md:px-5 py-2 md:py-2.5 rounded-md font-medium text-sm md:text-base bg-surface-100 text-surface-900 shadow-elevation-1 hover:bg-surface-200 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-surface-700 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200"
        >
          {MESSAGES.CLOSE_BUTTON}
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          aria-busy={isSaving}
          className={`
            px-3 md:px-5 py-2 md:py-2.5 rounded-md font-medium text-sm md:text-base transition-all duration-200
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

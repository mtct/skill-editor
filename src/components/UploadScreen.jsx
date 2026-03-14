import { useCallback, useRef, useState } from 'react'
import { MESSAGES } from '../constants/messages'

export function UploadScreen({ onFileLoad, error, theme, onToggleTheme }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file) => {
    if (file) {
      onFileLoad(file)
    }
  }, [onFileLoad])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0]
    handleFile(file)
  }, [handleFile])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  return (
    <main className="h-screen relative flex flex-col items-center justify-center bg-surface-50 px-6 py-12">
      {/* GitHub link */}
      <a
        href="https://github.com/mtct/skill-editor"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Repository GitHub"
        className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-lg text-surface-700 hover:bg-surface-100 hover:text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      </a>

      {/* Theme toggle */}
      <button
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? MESSAGES.TOGGLE_LIGHT : MESSAGES.TOGGLE_DARK}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg text-surface-700 hover:bg-surface-100 hover:text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
      >
        {theme === 'dark' ? (
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Wordmark */}
      <div className="mb-12 text-center">
        <span className="inline-flex items-center gap-2.5">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" className="fill-primary-500" />
            <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-semibold tracking-tight text-surface-900">Skill Editor</span>
        </span>
      </div>

      {/* Hero heading */}
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-surface-900 text-center mb-3 leading-[1.05]">
        Modifica le tue skill per agenti AI
      </h1>
      <p className="text-base text-surface-700 mb-12 text-center">
        Carica un file <code className="font-mono text-sm bg-surface-100 px-1.5 py-0.5 rounded text-surface-900">.skill</code> per iniziare
      </p>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={MESSAGES.UPLOAD_ARIA_LABEL}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={handleKeyDown}
        className={`
          w-full max-w-lg
          flex flex-col items-center justify-center py-14
          border-2 border-dashed rounded-xl
          cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50 shadow-elevation-3'
            : 'border-surface-200 bg-surface-0 shadow-elevation-1 hover:border-primary-500 hover:bg-primary-50 hover:shadow-elevation-2'
          }
        `}
      >
        {/* Upload icon */}
        <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none"
          className={`mb-4 transition-colors duration-200 ${isDragging ? 'text-primary-500' : 'text-surface-200'}`}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          <polyline points="16 8 12 4 8 8" />
          <line x1="12" y1="4" x2="12" y2="16" />
        </svg>

        <p className="text-sm font-medium text-surface-900 text-center px-6">
          {MESSAGES.UPLOAD_TITLE}
        </p>

        {error && (
          <p className="mt-4 text-danger-600 text-sm text-center px-4 font-medium">
            {error}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".skill"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* How it works — 3 steps */}
      <div className="mt-12 w-full max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-surface-700 text-center mb-6">
          {MESSAGES.HOW_IT_WORKS}
        </p>
        <ol className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-4">
          {[
            { num: '1', title: MESSAGES.ONBOARD_STEP1_TITLE, desc: MESSAGES.ONBOARD_STEP1_DESC },
            { num: '2', title: MESSAGES.ONBOARD_STEP2_TITLE, desc: MESSAGES.ONBOARD_STEP2_DESC },
            { num: '3', title: MESSAGES.ONBOARD_STEP3_TITLE, desc: MESSAGES.ONBOARD_STEP3_DESC },
          ].map(({ num, title, desc }) => (
            <li key={num} className="flex flex-col items-center text-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary-50 text-primary-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                {num}
              </span>
              <span className="text-sm font-semibold text-surface-900">{title}</span>
              <span className="text-xs text-surface-700 leading-snug">{desc}</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}

import { useState, useRef, useEffect, useCallback } from 'react'
import { MESSAGES } from '../constants/messages'

export function AddFileDialog({ isOpen, onClose, onAdd, existingDirs }) {
  const [mode, setMode] = useState('upload') // 'upload' | 'empty'
  const [selectedFile, setSelectedFile] = useState(null)
  const [targetPath, setTargetPath] = useState('')
  const [emptyName, setEmptyName] = useState('')
  const fileInputRef = useRef(null)
  const dialogRef = useRef(null)

  const handleClose = useCallback(() => {
    setSelectedFile(null)
    setTargetPath('')
    setEmptyName('')
    setMode('upload')
    onClose()
  }, [onClose])

  // Focus first interactive element when dialog opens
  useEffect(() => {
    if (!isOpen) return
    const focusable = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable?.length) {
      focusable[0].focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      if (!targetPath) {
        setTargetPath(file.name)
      } else if (targetPath.endsWith('/')) {
        // User typed a directory — append the filename automatically
        setTargetPath(targetPath + file.name)
      }
      // else: user typed a full explicit path — keep it as-is
    }
  }

  const handleAdd = () => {
    if (mode === 'empty') {
      const name = emptyName.trim()
      if (!name) return
      const finalPath = targetPath.trim()
        ? (targetPath.trim().endsWith('/') ? targetPath.trim() + name : targetPath.trim())
        : name
      onAdd(null, finalPath)
      handleClose()
    } else {
      if (selectedFile && targetPath.trim()) {
        onAdd(selectedFile, targetPath.trim())
        handleClose()
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
      return
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }

  // Common directory suggestions
  const suggestions = ['scripts/', 'references/', 'assets/', ...existingDirs]
    .filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-file-dialog-title"
        onKeyDown={handleKeyDown}
        className="bg-surface-0 rounded-xl shadow-elevation-4 p-6 w-full max-w-md dialog-enter"
      >
        <h2 id="add-file-dialog-title" className="text-lg font-semibold text-surface-900 mb-4">
          {MESSAGES.ADD_FILE}
        </h2>

        {/* Mode toggle */}
        <div className="flex rounded-md border border-surface-200 overflow-hidden mb-4">
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-primary-500 text-white'
                : 'bg-surface-0 text-surface-700 hover:bg-surface-100'
            }`}
          >
            {MESSAGES.ADD_FILE_MODE_UPLOAD}
          </button>
          <button
            onClick={() => setMode('empty')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === 'empty'
                ? 'bg-primary-500 text-white'
                : 'bg-surface-0 text-surface-700 hover:bg-surface-100'
            }`}
          >
            {MESSAGES.ADD_FILE_MODE_EMPTY}
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'upload' ? (
            /* File selection */
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                {MESSAGES.ADD_FILE_LABEL}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="block w-full my-2 py-2 text-sm text-surface-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 file:shadow-elevation-1 hover:file:bg-primary-500 hover:file:text-white hover:file:shadow-elevation-2 file:transition-all file:duration-200 file:cursor-pointer"
              />
            </div>
          ) : (
            /* Empty file name */
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                {MESSAGES.ADD_FILE_EMPTY_NAME}
              </label>
              <input
                type="text"
                value={emptyName}
                onChange={(e) => setEmptyName(e.target.value)}
                placeholder={MESSAGES.ADD_FILE_EMPTY_NAME_PLACEHOLDER}
                autoFocus
                className="w-full px-4 py-3 rounded-md border border-surface-200 bg-surface-0 text-base text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
          )}

          {/* Path input */}
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-2">
              {MESSAGES.ADD_FILE_PATH}
            </label>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder={MESSAGES.ADD_FILE_PATH_PLACEHOLDER}
              className="w-full px-4 py-3 rounded-md border border-surface-200 bg-surface-0 text-base text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-surface-700">
              {MESSAGES.ADD_FILE_PATH_HINT}
            </p>
          </div>

          {/* Quick suggestions */}
          {suggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                {MESSAGES.ADD_FILE_FOLDERS}
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 6).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => {
                      if (selectedFile) {
                        setTargetPath(dir + selectedFile.name)
                      } else {
                        setTargetPath(dir)
                      }
                    }}
                    className="px-3 min-h-[44px] rounded-md text-xs font-medium bg-surface-100 text-surface-900 shadow-elevation-1 hover:bg-primary-50 hover:text-primary-700 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-surface-100 text-surface-900 shadow-elevation-1 hover:bg-surface-200 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200"
          >
            {MESSAGES.ADD_FILE_CANCEL}
          </button>
          <button
            onClick={handleAdd}
            disabled={mode === 'upload' ? (!selectedFile || !targetPath.trim()) : !emptyName.trim()}
            className={`px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 ${
              (mode === 'upload' ? (selectedFile && targetPath.trim()) : emptyName.trim())
                ? 'bg-primary-500 text-white shadow-elevation-2 hover:bg-primary-700 hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98] active:shadow-elevation-1'
                : 'bg-surface-100 text-surface-700 shadow-elevation-1 cursor-not-allowed opacity-60'
            }`}
          >
            {MESSAGES.ADD_FILE_CONFIRM}
          </button>
        </div>
      </div>
    </div>
  )
}

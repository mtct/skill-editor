import { useState, useRef } from 'react'

export function AddFileDialog({ isOpen, onClose, onAdd, existingDirs }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [targetPath, setTargetPath] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Auto-suggest filename
      if (!targetPath) {
        setTargetPath(file.name)
      }
    }
  }

  const handleAdd = () => {
    if (selectedFile && targetPath.trim()) {
      onAdd(selectedFile, targetPath.trim())
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setTargetPath('')
    onClose()
  }

  // Common directory suggestions
  const suggestions = ['scripts/', 'references/', 'assets/', ...existingDirs]
    .filter((v, i, a) => a.indexOf(v) === i) // unique

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="bg-surface-0 rounded-lg shadow-elevation-4 p-6 w-full max-w-md transform transition-all duration-200">
        <h2 className="text-lg font-semibold text-surface-900 mb-4">Add File</h2>

        <div className="space-y-4">
          {/* File selection */}
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-2">
              Select file
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-surface-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 file:shadow-elevation-1 hover:file:bg-primary-500 hover:file:text-white hover:file:shadow-elevation-2 file:transition-all file:duration-200 file:cursor-pointer"
            />
          </div>

          {/* Path input */}
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-2">
              Destination path
            </label>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder="e.g.: scripts/helper.py or SKILL.md"
              className="w-full px-4 py-2 rounded-md border border-surface-200 bg-surface-0 text-base text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-surface-700">
              Include subfolders in path (e.g.: scripts/utils/helper.py)
            </p>
          </div>

          {/* Quick suggestions */}
          {suggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                Common folders
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
                    className="px-3 py-1 rounded-md text-xs font-medium bg-surface-100 text-surface-900 shadow-elevation-1 hover:bg-primary-50 hover:text-primary-700 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95 transition-all duration-200 cursor-pointer"
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
            className="px-4 py-2 rounded-md text-sm font-medium bg-surface-100 text-surface-900 shadow-elevation-1 hover:bg-surface-200 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedFile || !targetPath.trim()}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
              selectedFile && targetPath.trim()
                ? 'bg-primary-500 text-white shadow-elevation-2 hover:bg-primary-700 hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98] active:shadow-elevation-1'
                : 'bg-surface-100 text-surface-700 shadow-elevation-1 cursor-not-allowed opacity-60'
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

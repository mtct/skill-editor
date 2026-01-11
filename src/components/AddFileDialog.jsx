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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Aggiungi File</h2>

        <div className="space-y-4">
          {/* File selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleziona file
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Path input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Path di destinazione
            </label>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder="es: scripts/helper.py o SKILL.md"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Includi sottocartelle nel path (es: scripts/utils/helper.py)
            </p>
          </div>

          {/* Quick suggestions */}
          {suggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cartelle comuni
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
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
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
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Annulla
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedFile || !targetPath.trim()}
            className={`px-4 py-2 text-sm text-white rounded ${
              selectedFile && targetPath.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  )
}

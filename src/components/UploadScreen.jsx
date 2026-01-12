import { useCallback, useRef, useState } from 'react'
import { MESSAGES } from '../constants/messages'

export function UploadScreen({ onFileLoad, error }) {
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

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-surface-50 p-8">
      <h1 className="text-4xl font-bold text-surface-900 mb-8">
        Claude Skill Editor
      </h1>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          w-full max-w-2xl h-96
          flex flex-col items-center justify-center
          border-2 border-dashed rounded-2xl
          cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50 shadow-elevation-3'
            : 'border-surface-200 bg-surface-0 shadow-elevation-1 hover:border-primary-500 hover:bg-primary-50 hover:shadow-elevation-2'
          }
        `}
      >
        <p className="text-xl font-medium text-surface-900 text-center px-4">
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
    </div>
  )
}

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
    <div className="h-screen flex items-center justify-center bg-gray-50 p-8">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          w-full max-w-2xl h-96
          flex flex-col items-center justify-center
          border-2 border-dashed rounded-2xl
          cursor-pointer transition-colors duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <p className="text-xl font-medium text-gray-700 text-center px-4">
          {MESSAGES.UPLOAD_TITLE}
        </p>

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center px-4">
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

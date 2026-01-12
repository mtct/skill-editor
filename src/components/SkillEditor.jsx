import { useCallback } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { EditorPanel } from './EditorPanel'
import { ValidationToast } from './ValidationToast'

export function SkillEditor({
  fileName,
  files,
  selectedFile,
  isModified,
  isSaving,
  validationErrors,
  onSelectFile,
  onUpdateFile,
  onAddFile,
  onDeleteFile,
  onSave,
  onClose,
  onClearErrors,
}) {
  // Get current file data
  const currentFileData = selectedFile ? files[selectedFile] : null

  // Handle content change
  const handleContentChange = useCallback((newContent) => {
    if (selectedFile) {
      onUpdateFile(selectedFile, newContent)
    }
  }, [selectedFile, onUpdateFile])

  // Handle file deletion with confirmation
  const handleDelete = useCallback((path) => {
    const fileName = path.split('/').pop()
    if (window.confirm(`Sei sicuro di voler eliminare "${fileName}"?`)) {
      onDeleteFile(path)
    }
  }, [onDeleteFile])

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        fileName={fileName}
        onSave={onSave}
        onClose={onClose}
        isSaving={isSaving}
        isModified={isModified}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          files={files}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
          onDeleteFile={handleDelete}
          onAddFile={onAddFile}
        />

        <EditorPanel
          filePath={selectedFile}
          content={currentFileData?.content}
          isBinary={currentFileData?.isBinary}
          onChange={handleContentChange}
        />
      </div>

      <ValidationToast
        errors={validationErrors}
        onClose={onClearErrors}
      />
    </div>
  )
}

import { useCallback, useState } from 'react'
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
  theme,
  onToggleTheme,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    <div className="h-screen flex flex-col bg-surface-0">
      <Header
        fileName={fileName}
        onSave={onSave}
        onClose={onClose}
        isSaving={isSaving}
        isModified={isModified}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(v => !v)}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="flex-1 flex overflow-hidden">
        <Sidebar
          files={files}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
          onDeleteFile={handleDelete}
          onAddFile={onAddFile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <EditorPanel
          filePath={selectedFile}
          content={currentFileData?.content}
          isBinary={currentFileData?.isBinary}
          onChange={handleContentChange}
        />
      </main>

      <ValidationToast
        errors={validationErrors}
        onClose={onClearErrors}
      />
    </div>
  )
}

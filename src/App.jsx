import { lazy, Suspense } from 'react'
import { useSkillState } from './hooks/useSkillState'
import { useTheme } from './hooks/useTheme'
import { UploadScreen } from './components/UploadScreen'

const SkillEditor = lazy(() =>
  import('./components/SkillEditor').then(m => ({ default: m.SkillEditor }))
)

// Preload editor bundle in the background after first paint
// so it's ready by the time the user loads a .skill file
if (typeof window !== 'undefined') {
  setTimeout(() => import('./components/SkillEditor'), 500)
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    appState,
    fileName,
    files,
    selectedFile,
    isModified,
    isSaving,
    validationErrors,
    loadError,
    loadSkill,
    selectFile,
    updateFile,
    addFile,
    deleteFile,
    saveSkill,
    reset,
    clearErrors,
  } = useSkillState()

  // Upload screen
  if (appState === 'upload') {
    return (
      <UploadScreen
        onFileLoad={loadSkill}
        error={loadError}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  // Editor screen
  return (
    <Suspense fallback={null}>
      <SkillEditor
      fileName={fileName}
      files={files}
      selectedFile={selectedFile}
      isModified={isModified}
      isSaving={isSaving}
      validationErrors={validationErrors}
      onSelectFile={selectFile}
      onUpdateFile={updateFile}
      onAddFile={addFile}
      onDeleteFile={deleteFile}
      onSave={saveSkill}
      onClose={reset}
      theme={theme}
      onToggleTheme={toggleTheme}
      onClearErrors={clearErrors}
    />
    </Suspense>
  )
}

export default App

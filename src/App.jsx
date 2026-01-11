import { useSkillState } from './hooks/useSkillState'
import { UploadScreen } from './components/UploadScreen'
import { SkillEditor } from './components/SkillEditor'

function App() {
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
    clearErrors,
  } = useSkillState()

  // Upload screen
  if (appState === 'upload') {
    return (
      <UploadScreen
        onFileLoad={loadSkill}
        error={loadError}
      />
    )
  }

  // Editor screen
  return (
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
      onClearErrors={clearErrors}
    />
  )
}

export default App
